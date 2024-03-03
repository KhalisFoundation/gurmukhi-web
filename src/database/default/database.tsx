import { WordType } from 'types';
import { wordsdb } from '../../firebase';
import {
  CollectionReference,
  DocumentData,
  QueryFieldFilterConstraint,
  collection,
  documentId,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { generateRandomId } from 'database/util';

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
};


const getRandomData = async (
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  conditions: QueryFieldFilterConstraint[],
  key?: string | null,
  limitVal?: number,
  random: boolean = true,
) => {
  const randomId = generateRandomId();
  const fieldPath = key ? key : documentId();
  const allConditions = [
    ...conditions,
  ] as any[];
  if (random) {
    allConditions.push(where(fieldPath, '>=', randomId));
  }

  let querySnapshot = null;
  const queryRef = limitVal
    ? query(
      collectionRef,
      ...allConditions,
      limit(limitVal),
    )
    : query(collectionRef, ...allConditions);
  querySnapshot = await getDocs(queryRef);
  console.log('querySnapshot', querySnapshot);

  if (querySnapshot.empty) {
    const altConditions = [
      ...conditions,
      where(fieldPath, '<', randomId),
    ] as any;
    if (limitVal) altConditions.push(limit(limitVal));
    const queryRef2 = query(
      collectionRef,
      ...altConditions,
    );
    querySnapshot = await getDocs(queryRef2);
    console.log('querySnapshot2: ', querySnapshot);
  }

  if (limitVal && limitVal > 1) {
    console.log('querySnapshot.docs', querySnapshot.docs);
    return querySnapshot.docs.map((doc) => doc.data());
  } else {
    console.log('querySnapshot.docs[0].data()', querySnapshot.docs[0].data());
    return {
      ...querySnapshot.docs[0].data(),
      id: querySnapshot.docs[0].id,
    };
  }
};

const getSemanticsByIds = async (
  synonymsIds: string[],
  antonymsIds: string[],
) => {
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
      const sentences = await getDataById(
        wordId,
        sentencesCollection,
        'word_id',
        3,
      );
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

const getRandomWord = async (notInArray: string[] = ['unknown']) => {
  try {
    const wordData = (await getRandomData(
      wordsCollection,
      [
        where('status', '==', 'active'),
        where('id', 'not-in', notInArray),
      ],
      null,
      1,
      false,
    )) as WordType;

    if (wordData) {
      const wordId = wordData.id;
      if (wordId) {
        const sentences = await getDataById(
          wordId,
          sentencesCollection,
          'word_id',
          3,
        );
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
      }
    }
  } catch (error) {
    console.error('No such Document', error);
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
