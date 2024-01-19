import { shabadavaliDB } from '../../firebase';
import { QuestionType } from 'types/shabadavlidb';
import { addDoc, collection } from 'firebase/firestore';

export const addQuestionToSubCollection = async (
  uid: string,
  data: QuestionType,
) => {
  try {
    const questionCollectionRef = collection(
      shabadavaliDB,
      'users',
      uid,
      'questions',
    );
    const docRef = await addDoc(questionCollectionRef, data);
    console.log('Document added', docRef.id);
  } catch (error) {
    console.error('Error: unable to add Question', error);
  }
};
