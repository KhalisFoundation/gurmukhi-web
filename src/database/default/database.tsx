import { WordType } from 'types';
import { wordsdb } from '../../firebase';
import {
  and,
  collection,
  CollectionReference,
  documentId,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryCompositeFilterConstraint,
  QueryFieldFilterConstraint,
  where,
} from 'firebase/firestore';
// import { generateRandomId } from 'database/util';
import { getUserData } from 'database/shabadavalidb';
import { bugsnagErrorHandler } from 'utils';

const wordsCollection = collection(wordsdb, 'words');
const sentencesCollection = collection(wordsdb, 'sentences');

const getDataById = async (
  id: string,
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  key?: string | null,
  limitVal?: number,
  miniWord?: boolean,
) => {
  const fieldPath = key ? key : documentId();
  const queryRef = limitVal
    ? query(collectionRef, where(fieldPath, '==', id), limit(limitVal))
    : query(collectionRef, where(fieldPath, '==', id));
  const querySnapshot = await getDocs(queryRef);

  try {
    if (limitVal && limitVal > 1) {
      return querySnapshot.docs.map((doc) => doc.data());
    } else {
      if (miniWord) {
        const { word, translation } = querySnapshot.docs[0].data();
  
        return {
          id,
          word,
          translation,
        };
      }
      return querySnapshot.docs[0].data();
    }
  } catch (error) {
    bugsnagErrorHandler(
      'tester',
      error,
      'getDataById',
      { id, key, miniWord, querySnapshot, docs: querySnapshot.docs },
    );
  }
};


const getRandomData = async (
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  conditions: QueryCompositeFilterConstraint | QueryFieldFilterConstraint,
  key?: string | null,
  limitVal?: number,
) => {
  // const randomId = generateRandomId();
  // const fieldPath = key ? key : documentId();
  const queryRef = limitVal
    ? query(collectionRef, and(conditions), limit(limitVal))
    : query(collectionRef, and(conditions));
  const querySnapshot = await getDocs(queryRef!);

  if (!querySnapshot.empty) {
    if (limitVal && limitVal > 1) {
      return querySnapshot.docs.map((doc) => doc.data());
    } else {
      return [
        {
          ...querySnapshot.docs[0].data(),
          id: querySnapshot.docs[0].id,
        },
      ];
    }
  } else {
    return null;
  }
};

const getSemanticsByIds = async (synonymsIds: string[], antonymsIds: string[]) => {
  const synonymsPromises: any = (synonymsIds || []).map((synonym) =>
    getDataById(synonym.toString(), wordsCollection, null, 1, true),
  );
  const antonymsPromises: any = (antonymsIds || []).map((antonym) =>
    getDataById(antonym.toString(), wordsCollection, null, 1, true),
  );

  const [synonyms, antonyms] = await Promise.all([
    Promise.all(synonymsPromises),
    Promise.all(antonymsPromises),
  ]);

  return {
    synonyms,
    antonyms,
  };
};

const getWordById = async (wordId: string, needExtras = false) => {
  const wordData = (await getDataById(wordId, wordsCollection)) as WordType;

  if (wordData) {
    if (needExtras) {
      const sentences = await getDataById(wordId, sentencesCollection, 'word_id', 3);
      const { synonyms, antonyms } = await getSemanticsByIds(
        wordData.synonyms as string[],
        wordData.antonyms as string[],
      );

      return {
        ...wordData,
        id: wordId,
        sentences,
        synonyms,
        antonyms,
      } as WordType;
    } else {
      return {
        ...wordData,
        id: wordId,
      } as WordType;
    }
  } else {
    console.error('No such document!');
    return null;
  }
};

const getRandomWord = async (uid: string, notInArray: any[], includeUsed = true) => {
  try {
    const userData = await getUserData(uid);
    const existingWordIds = includeUsed ? notInArray.concat(userData?.wordIds || []) : notInArray;

    const batches = [];
    if (existingWordIds.length === 0) {
      const wordData = await getRandomData(
        wordsCollection,
        where('status', '==', 'active'),
        null,
        10,
      );
      batches.push(wordData);
    } else {
      for (let i = 0; i < existingWordIds.length; i += 10) {
        const batchIds = existingWordIds.slice(i, i + 10);
        const wordData = await getRandomData(
          wordsCollection,
          and(where('status', '==', 'active'), where(documentId(), 'not-in', batchIds)),
          null,
          10,
        );
        batches.push(wordData);
      }
    }

    const resolvedWords = await Promise.all(batches);
    const wordDataArray = [] as WordType[];

    if (resolvedWords.length > 0) {
      for (const words of resolvedWords) {
        if (words && words.length > 0) {
          for (const word of words) {
            if (!existingWordIds.includes(word.id)) {
              wordDataArray.push(word as WordType);
            }
          }
        }
      }
    }
    const wordData =
      wordDataArray.length > 0 ? wordDataArray[0] : (resolvedWords[0] as WordType[])[0];

    const wordId = wordData.id;
    const sentences = await getDataById(wordId, sentencesCollection, 'word_id', 3);
    const { synonyms, antonyms } = await getSemanticsByIds(
      wordData.synonyms as string[],
      wordData.antonyms as string[],
    );

    return {
      ...wordData,
      id: wordId,
      sentences,
      synonyms,
      antonyms,
    } as WordType;
  } catch (error) {
    bugsnagErrorHandler(uid, error, 'database/default/database.tsx/getRandomWord', {
      notInArray,
      includeUsed: includeUsed,
    });
  }
};

export {
  wordsCollection,
  sentencesCollection,
  getDataById,
  getRandomData,
  getSemanticsByIds,
  getWordById,
  getRandomWord,
};
