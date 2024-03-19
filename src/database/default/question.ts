import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { getDataById, wordsCollection } from './database';
import { wordsdb } from '../../firebase';
import { Option, QuestionData } from 'types';
import { generateRandomId } from 'database/util';

const questionCollection = collection(wordsdb, 'questions');

const getOptions = async (wordIDs: string[]) => {
  const optionsPromise = wordIDs.map((option) => {
    return getDataById(option.toString(), wordsCollection, null, 1, true);
  });
  const options = await Promise.all(optionsPromise);
  return options as Option[];
};
const getQuestions = async (wordID: string, questionIDs: string[], needOptions: boolean = true) => {
  let queryRef;
  if (questionIDs.length === 0) {
    queryRef = query(questionCollection, where('word_id', '==', wordID), limit(2));
  } else {
    queryRef = query(
      questionCollection,
      where('word_id', '==', wordID),
      where('id', 'not-in', questionIDs),
      limit(2),
    );
  }
  const questionSnapshots = await getDocs(queryRef);
  if (questionSnapshots.empty) {
    return [];
  }
  const questionsData = await Promise.all(
    questionSnapshots.docs.map(async (doc) => {
      const questionData = doc.data() as QuestionData;

      if (
        needOptions &&
        questionData.options.length > 0 &&
        typeof questionData.options[0] === 'string'
      ) {
        const options = await getOptions(questionData.options as string[]);
        return { ...questionData, options } as QuestionData;
      }

      return questionData;
    }),
  );
  return questionsData;
};
const getQuestionsByWordID = async (
  wordID: string,
  count: number,
  notInArray: string[],
  needOptions = false,
) => {
  const randomID = generateRandomId();
  let queryRef;
  if (notInArray.length === 0) {
    queryRef = query(
      questionCollection,
      where('word_id', '==', wordID),
      where('id', '<=', randomID),
      limit(count),
    );
  } else {
    queryRef = query(
      questionCollection,
      where('word_id', '==', wordID),
      where('id', '<=', randomID),
      where('id', 'not-in', notInArray),
      limit(count),
    );
  }
  let questionSnapshots = null;
  questionSnapshots = await getDocs(queryRef);

  if (questionSnapshots.empty) {
    const queryRef2 = query(
      questionCollection,
      where('word_id', '==', wordID),
      where('id', '>', randomID),
      limit(count),
    );
    questionSnapshots = await getDocs(queryRef2);
    if (questionSnapshots.empty) {
      return [];
    }
  }

  const questionsData = await Promise.all(
    questionSnapshots.docs.map(async (doc) => {
      const questionData = doc.data() as QuestionData;

      if (
        needOptions &&
        questionData.options.length > 0 &&
        typeof questionData.options[0] === 'string'
      ) {
        const options = await getOptions(questionData.options as string[]);
        return { ...questionData, options } as QuestionData;
      }

      return questionData;
    }),
  );

  return questionsData;
};
const getQuestionByID = async (id: string) => {
  const queryRef = query(questionCollection, where('id', '==', id));
  const questionSnapshot = await getDocs(queryRef);
  if (questionSnapshot.empty) {
    return null;
  }
  const questionData = questionSnapshot.docs[0].data();
  if (questionData.options.length > 0 && typeof questionData.options[0] === 'string') {
    const options = await getOptions(questionData.options as string[]);
    return { ...questionData, options } as QuestionData;
  }
  return questionData as QuestionData;
};

export { getQuestionsByWordID, getQuestionByID, getQuestions };
