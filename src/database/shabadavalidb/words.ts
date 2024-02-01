import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { shabadavaliDB } from '../../firebase';
import { WordShabadavaliDB } from 'types/shabadavalidb';
import ALL_CONSTANT from 'constants/constant';

const getWordCollectionRef = (uid: string) => {
  return collection(shabadavaliDB, ALL_CONSTANT.USERS, uid, ALL_CONSTANT.WORDS);
};
export const addWordsToSubCollection = async (
  uid: string,
  data: WordShabadavaliDB,
) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const docRef = await addDoc(wordsCollectionRef, data);
    console.log('Document added', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

export const getLearningWordsFromUser = async (uid: string) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const q = query(
      wordsCollectionRef,
      where('isLearnt', '==', false),
      limit(5),
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    return documents as WordShabadavaliDB[];
  } catch (error) {
    console.error(error);
  }
};
export const getLearntWordsFromUser = async (uid: string) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const q = query(
      wordsCollectionRef,
      where('isLearnt', '==', true),
      limit(5),
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    return documents as WordShabadavaliDB[];
  } catch (error) {
    console.error(error);
  }
};
export const addWordsBatch = async (
  uid: string,
  words: WordShabadavaliDB[],
) => {
  const wordsCollectionRef = getWordCollectionRef(uid);
  const batch = writeBatch(shabadavaliDB);
  for (const wordData of words) {
    const q = query(
      wordsCollectionRef,
      where('word_id', '==', wordData.word_id),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const docRef = doc(wordsCollectionRef);
      batch.set(docRef, wordData);
    }
  }
  try {
    await batch.commit();
  } catch (error) {
    console.error('Error committing the batch', error);
  }
};

export const updateWordFromUser = async (uid: string, wordID: string) => {
  const wordsCollectionRef = getWordCollectionRef(uid);
  try {
    const q = query(wordsCollectionRef, where('word_id', '==', wordID));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const wordDoc = querySnapshot.docs[0];
      const wordData = wordDoc.data() as WordShabadavaliDB;
      const currentProgress = wordData.progress;
      let isLearnt = wordData.isLearnt;
      if (currentProgress + 1 >= 4) {
        isLearnt = true;
      }
      const documentRef = doc(wordsCollectionRef, querySnapshot.docs[0].id);
      await updateDoc(documentRef, {
        progress: currentProgress + 1,
        isLearnt: isLearnt,
      });
      console.log('updated words doc');
    }
  } catch (error) {
    console.error('Error updating the doc', error);
  }
};

export const checkIfWordPresent = async (uid: string, wordID: string) => {
  const wordsCollectionRef = getWordCollectionRef(uid);
  const q = query(wordsCollectionRef, where('word_id', '==', wordID));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const getLearntWords = async (uid: string) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const q = query(wordsCollectionRef, where('isLearnt', '==', true));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    return documents as WordShabadavaliDB[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
