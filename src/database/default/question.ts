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

function buildQuestionQuery(
  wordID: string,
  randomID: string,
  count: number,
  isLearnt: boolean,
  direction: 'before' | 'after',
  excludedQuestionIDs: string[] = [],
) {
  let directionCondition =
    direction === 'before' ? where('id', '<=', randomID) : where('id', '>', randomID);
  let exclusionCondition =
    excludedQuestionIDs.length > 0 ? where('id', 'not-in', excludedQuestionIDs) : null;

  if (isLearnt && excludedQuestionIDs.length > 0) {
    const randomQuestionID =
      excludedQuestionIDs[Math.floor(Math.random() * excludedQuestionIDs.length)];
    directionCondition = where('id', '==', randomQuestionID);
    exclusionCondition = null;
  }

  return query(
    questionCollection,
    where('word_id', '==', wordID),
    directionCondition,
    ...(exclusionCondition ? [exclusionCondition] : []),
    limit(count),
  );
}
async function getQuestionsByWordID(
  wordID: string,
  count: number,
  isLearnt: boolean,
  needOptions: boolean = false,
  wordQuestionIDs: string[] = [],
): Promise<QuestionData[]> {
  const randomID = generateRandomId();

  // Initial query attempting to fetch questions before the randomID
  let queryRef = buildQuestionQuery(wordID, randomID, count, isLearnt, 'before', wordQuestionIDs);

  let questionSnapshots = await getDocs(queryRef);

  // If no questions found, attempt to fetch questions after the randomID
  if (questionSnapshots.empty) {
    queryRef = queryRef = buildQuestionQuery(
      wordID,
      randomID,
      count,
      isLearnt,
      'after',
      wordQuestionIDs,
    );
    questionSnapshots = await getDocs(queryRef);

    if (questionSnapshots.empty) {
      return [];
    }
  }

  const questionsData = questionSnapshots.docs.map((doc) => doc.data() as QuestionData);

  // Only fetch options if needed
  if (needOptions) {
    return Promise.all(
      questionsData.map(async (question) => {
        // Ensure there are options to fetch and they are in the expected format
        if (
          question.options &&
          question.options.length > 0 &&
          typeof question.options[0] === 'string'
        ) {
          const options = await getOptions(question.options as string[]);
          return { ...question, options };
        }
        return question;
      }),
    );
  }

  return questionsData;
}

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

export { getQuestionsByWordID, getQuestionByID };
