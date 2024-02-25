import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { getDataById, wordsCollection } from './database';
import { wordsdb } from '../../firebase';
import { Option, QuestionData } from 'types';
import { generateRandomId } from 'database/util';
import { getQuestionIdsFromWordInUser } from 'database/shabadavalidb';

const questionCollection = collection(wordsdb, 'questions');

const getOptions = async (wordIDs: string[]) => {
  const optionsPromise = wordIDs.map((option) => {
    return getDataById(option.toString(), wordsCollection, null, 1, true);
  });
  const options = await Promise.all(optionsPromise);
  return options as Option[];
};

const getQuestionsByWordID = async (wordID: string, count:number, uid: string, needOptions = false) => {
  const randomID = generateRandomId();
  const existingQuestions = await getQuestionIdsFromWordInUser(uid, wordID);
  const questCondition = existingQuestions.length > 0 ?
    [where('id', 'not-in', existingQuestions)] :
    [];
  const queryRef = query(
    questionCollection,
    where('word_id', '==', wordID),
    where('id', '<=', randomID),
    ...questCondition,
    limit(count),
  );
  let questionSnapshots = null;
  questionSnapshots = await getDocs(queryRef);

  if (questionSnapshots.empty) {
    const queryRef2 = query(
      questionCollection,
      where('word_id', '==', wordID),
      where('id', '>', randomID),
      ...questCondition,
      limit(count),
    );
    questionSnapshots = await getDocs(queryRef2);
    if (questionSnapshots.empty) {
      return [];
    }
  }

  const questionsData = await Promise.all(
    questionSnapshots.docs.map(async (doc) => {
      const questionData = {
        id: doc.id, ...doc.data(),
      } as QuestionData;

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

export { getQuestionsByWordID, getQuestionByID };
