import { collection, getDocs, limit, query, where, documentId } from 'firebase/firestore';
import { getDataById, wordsCollection } from './database';
import { wordsdb } from '../../firebase';
import { Option, QuestionData } from 'types';
import { bugsnagErrorHandler } from 'utils';

const questionCollection = collection(wordsdb, 'questions');

const getOptions = async (wordIDs: string[]) => {
  const optionsPromise = wordIDs.map((option) => {
    if (typeof option === 'string') {
      return getDataById(option.toString(), wordsCollection, null, 1, true);
    } else {
      return option;
    }
  });
  const options = await Promise.all(optionsPromise);
  return options as Option[];
};
const getQuestions = async (wordID: string, questionIDs: string[], needOptions: boolean = true) => {
  const filteredQuestionIDs = questionIDs.filter((id) => id !== '');
  try {
    let queryRef;
    if (filteredQuestionIDs.length === 0) {
      queryRef = query(questionCollection, where('word_id', '==', wordID), limit(2));
    } else {
      queryRef = query(
        questionCollection,
        where('word_id', '==', wordID),
        where(documentId(), 'not-in', filteredQuestionIDs),
        limit(2),
      );
    }
    const questionSnapshots = await getDocs(queryRef);
    if (questionSnapshots.empty) {
      return [];
    }
    const questionsData = await Promise.all(
      questionSnapshots.docs.map(async (doc) => {
        const questionData = {
          ...doc.data(),
          id: doc.id,
        } as QuestionData;
  
        if (
          needOptions &&
          questionData.options.length > 0
        ) {
          try {
            const options = await getOptions(questionData.options as string[]);
            return { ...questionData, options } as QuestionData;
          } catch (error) {
            bugsnagErrorHandler(error, 'database/default/question.ts/getOptions', { questionData });
            return questionData;
          }
        }
        return questionData;
      }),
    );
    return questionsData;
  } catch (error) {
    bugsnagErrorHandler(
      error,
      'database/default/question.ts/getQuestions',
      { wordID, questionIDs, filteredQuestionIDs, needOptions },
    );
    return [];
  }
};
const getQuestionByID = async (id: string) => {
  try {
    const queryRef = query(questionCollection, where(documentId(), '==', id));
    const questionSnapshot = await getDocs(queryRef);
    if (questionSnapshot.empty) {
      return;
    }
    const questionData = questionSnapshot.docs[0].data();
    if (questionData.options.length > 0 && typeof questionData.options[0] === 'string') {
      const options = await getOptions(questionData.options as string[]);
      return { ...questionData, options } as QuestionData;
    }
    return questionData as QuestionData;
  } catch (error) {
    bugsnagErrorHandler(error, 'getQuestionByID', { id });
  }
};

export { getQuestionByID, getQuestions };
