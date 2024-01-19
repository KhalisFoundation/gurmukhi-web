import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { shabadavaliDB } from '../../firebase';
import { WordShabadavaliDB } from 'types/shabadavlidb';
import ALL_CONSTANT from 'constants/constant';

export const addWordsToSubCollection = async (
  uid: string,
  data: WordShabadavaliDB,
) => {
  try {
    const wordsCollectionRef = collection(
      shabadavaliDB,
      ALL_CONSTANT.USERS,
      uid,
      ALL_CONSTANT.WORDS,
    );
    const docRef = await addDoc(wordsCollectionRef, data);
    console.log('Document added', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

export const getLearningWordsFromUser = async (uid: string) => {
  try {
    const wordsCollectionRef = collection(
      shabadavaliDB,
      ALL_CONSTANT.USERS,
      uid,
      ALL_CONSTANT.WORDS,
    );
    const q = query(wordsCollectionRef, where('isLearnt', '==', false));
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
  const wordsCollectionRef = collection(
    shabadavaliDB,
    ALL_CONSTANT.USERS,
    uid,
    ALL_CONSTANT.WORDS,
  );
  const batch = writeBatch(shabadavaliDB);
  words.forEach((data) => {
    const docRef = doc(wordsCollectionRef);
    batch.set(docRef, data);
  });
  try {
    await batch.commit();
  } catch (error) {
    console.error('Error committing the batch', error);
  }
};
