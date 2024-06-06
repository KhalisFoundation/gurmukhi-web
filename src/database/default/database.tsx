import { MiniWord, WordType } from 'types';
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
import { bugsnagErrorHandler } from 'utils';
import CONSTANTS from 'constants/constant';

const wordsCollection = collection(wordsdb, 'words');
const sentencesCollection = collection(wordsdb, 'sentences');

const getDataById = async (
  id: string,
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  key?: string | null,
  limitVal?: number,
  miniWord?: boolean,
) => {
  try {
    const fieldPath = key || documentId();
    const queryRef = limitVal
      ? query(collectionRef, where(fieldPath, '==', id), limit(limitVal))
      : query(collectionRef, where(fieldPath, '==', id));
    const querySnapshot = await getDocs(queryRef);

    if (querySnapshot.empty) {
      return null;
    }

    if (limitVal && limitVal > CONSTANTS.DEFAULT_ONE) {
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } else {
      const currentDoc = querySnapshot.docs[0];
      if (miniWord) {
        const { word, translation } = currentDoc.data();

        return {
          id,
          word,
          translation,
        };
      }
      return {
        ...currentDoc.data(),
        id: currentDoc.id,
      };
    }
  } catch (error) {
    bugsnagErrorHandler(error, 'getDataById', {
      id,
      key,
      miniWord,
    });
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
    if (limitVal && limitVal > CONSTANTS.DEFAULT_ONE) {
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
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

const getSemanticsByIds = async (
  synonymsIds: (string | MiniWord)[],
  antonymsIds: (string | MiniWord)[],
) => {
  const synonymsPromises =
    synonymsIds.length > 0
      ? synonymsIds.map((synonym) => {
        if (typeof synonym === 'string') {
          return getDataById(
            synonym.toString(),
            wordsCollection,
            null,
            CONSTANTS.DEFAULT_ONE,
            true,
          ) as MiniWord;
        } else {
          return synonym;
        }
      })
      : [];
  const antonymsPromises =
    antonymsIds.length > 0
      ? antonymsIds.map((antonym) => {
        if (typeof antonym === 'string') {
          return getDataById(
            antonym.toString(),
            wordsCollection,
            null,
            CONSTANTS.DEFAULT_ONE,
            true,
          ) as MiniWord;
        } else {
          return antonym;
        }
      })
      : [];

  const [synonyms, antonyms] = await Promise.all([
    Promise.all(synonymsPromises),
    Promise.all(antonymsPromises),
  ]);

  return {
    synonyms,
    antonyms,
  } as { synonyms: MiniWord[]; antonyms: MiniWord[] };
};

const getWordById = async (wordId: string, needExtras = false) => {
  const wordData = (await getDataById(wordId, wordsCollection)) as WordType;

  if (wordData) {
    if (needExtras) {
      const sentences = await getDataById(
        wordId,
        sentencesCollection,
        'word_id',
        CONSTANTS.DATA_LIMIT,
      );
      const { synonyms, antonyms } = await getSemanticsByIds(
        wordData.synonyms as (string | MiniWord)[],
        wordData.antonyms as (string | MiniWord)[],
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

const getActiveWords = async () => {
  const qSnapshot = query(wordsCollection, where('status', '==', 'active'));
  const querySnapshot = await getDocs(qSnapshot);
  if (querySnapshot.empty) {
    return null;
  }
  const wordData = querySnapshot.docs.map((item) => ({ id: item.id, ...item.data() } as WordType));
  return wordData;
};
export {
  wordsCollection,
  sentencesCollection,
  getDataById,
  getRandomData,
  getSemanticsByIds,
  getWordById,
  getActiveWords,
};
