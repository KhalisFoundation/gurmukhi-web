import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { generateRandomId, getDataById, wordsCollection } from 'utils';
import { wordsdb } from '../firebase';
import { Option, QuestionData } from 'types';

const questionCollection = collection(wordsdb, 'questions');

const getOptions = async (wordIDs: string[]) => {
  const optionsPromise = wordIDs.map((option) => {
    console.log(option);
    return getDataById(option.toString(), wordsCollection, null, 1, true);
  });
  const options = await Promise.all(optionsPromise);
  return options as Option[];
};
const getQuestionsByWordID = async (wordID: string, needOptions = false) => {
  const queryRef = query(questionCollection, where('word_id', '==', wordID));
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
const getQuestionByID = async (id: string) => {
  const queryRef = query(questionCollection, where('id', '==', id));
  const questionSnapshot = await getDocs(queryRef);
  if (questionSnapshot.empty) {
    return null;
  }
  const questionData = questionSnapshot.docs[0].data();
  if (
    questionData.options.length > 0 &&
    typeof questionData.options[0] === 'string'
  ) {
    const options = await getOptions(questionData.options as string[]);
    return { ...questionData, options } as QuestionData;
  }
  return questionData as QuestionData;
};

const getRandomQuestion = async (wordID: string) => {
  const randomID = generateRandomId();
  const queryRef = query(
    questionCollection,
    where('id', '>=', randomID),
    where('word_id', '==', wordID),
    limit(1),
  );
  const questionSnapshot = await getDocs(queryRef);
  const questionData = questionSnapshot.docs[0].data();
  if (
    questionData.options.length > 0 &&
    typeof questionData.options[0] === 'string'
  ) {
    const options = await getOptions(questionData.options as string[]);
    return { ...questionData, options } as QuestionData;
  }
  return questionData as QuestionData;
};
export { getQuestionsByWordID, getQuestionByID, getRandomQuestion };
