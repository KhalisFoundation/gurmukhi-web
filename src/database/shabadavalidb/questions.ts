import { shabadavaliDB } from '../../firebase';
import { QuestionType } from 'types/shabadavalidb';
import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  limit,
} from 'firebase/firestore';
import ALL_CONSTANT from 'constants/constant';
// import { generateRandomId } from 'database/default';

const getQuestionCollectionRef = (uid: string) =>
  collection(shabadavaliDB, ALL_CONSTANT.USERS, uid, ALL_CONSTANT.QUESTIONS);

export const checkIfQuestionPresent = async (
  uid: string,
  questionID: string,
) => {
  const questionCollectionRef = getQuestionCollectionRef(uid);
  const q = query(
    questionCollectionRef,
    where('question_id', '==', questionID),
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const updateQuestionFromUser = async (
  uid: string,
  data: QuestionType,
) => {
  const questionCollectionRef = getQuestionCollectionRef(uid);
  const q = query(
    questionCollectionRef,
    where('question_id', '==', data.question_id),
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const documentRef = doc(questionCollectionRef, querySnapshot.docs[0].id);
    await updateDoc(documentRef, {
      lastReviewed: Timestamp.fromDate(new Date()),
      isLearnt: data.isLearnt,
    });
  } else {
    console.log('Document with the specified questionID not found.');
  }
};

export const addQuestionToSubCollection = async (
  uid: string,
  data: QuestionType,
) => {
  const exists = await checkIfQuestionPresent(uid, data.question_id);
  if (exists) {
    await updateQuestionFromUser(uid, data);
    console.log('Document updated:', data.id);
    return;
  }
  const questionCollectionRef = getQuestionCollectionRef(uid);
  const docRef = await addDoc(questionCollectionRef, {
    ...data,
    lastReviewed: Timestamp.fromDate(new Date()),
  });
  console.log('Document added:', docRef.id);
};
export const getRandomQuestion = async (
  uid: string,
  isLearnt: boolean,
  count: number,
) => {
  // const randomID = generateRandomId();
  const questionCollectionRef = getQuestionCollectionRef(uid);
  const queryRef = query(
    questionCollectionRef,
    where('isLearnt', '==', isLearnt),
    // where('id', '<=', randomID),
    limit(count),
  );
  const questionSnapshots = await getDocs(queryRef);

  if (questionSnapshots.empty) {
    return [];
  }
  const questionsData = questionSnapshots.docs.map((document) =>
    document.data(),
  );

  return questionsData as QuestionType[];
};
