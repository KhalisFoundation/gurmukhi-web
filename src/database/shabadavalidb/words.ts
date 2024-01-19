import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { shabadavaliDB } from '../../firebase';
import { WordShabadavaliDB } from 'types/shabadavlidb';

export const addWordsToSubCollection = async (
  uid: string,
  data: WordShabadavaliDB,
) => {
  try {
    const wordsCollectionRef = collection(shabadavaliDB, 'users', uid, 'words');
    const docRef = await addDoc(wordsCollectionRef, data);
    console.log('Document added', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

export const getLearningWordsFromUser = async (uid: string) => {
  try {
    const wordsCollectionRef = collection(shabadavaliDB, 'users', uid, 'words');
    const q = query(wordsCollectionRef, where('isLearnt', '==', false));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents as WordShabadavaliDB[];
  } catch (error) {
    console.error(error);
  }
};
