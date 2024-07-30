import { getOptions, getQuestions } from 'database/default';
import { addQuestionsBatch, getWords } from 'database/shabadavalidb';
import ALL_CONSTANT from 'constants/constant';
import { QuestionData, User, GameScreen, WordShabadavaliDB } from 'types';
import { createGameScreen, shuffleArray } from '../utils';
import { bugsnagErrorHandler } from 'utils';
import { WriteBatch } from 'firebase/firestore';
import { WordQuestionMap } from 'types';

const getRandomQuestions = async (
  user: User,
  count: number,
  isLearnt: boolean,
  batch: WriteBatch,
  questionIds?: string[],
) => {
  const gameArray: GameScreen[] = [];
  try {
    let words: WordShabadavaliDB[] = await getWords(user.uid, isLearnt);
    if (words.length === 0) {
      words = await getWords(user.uid, !isLearnt);
    }
    let questionsPromises;
    if (isLearnt && questionIds) {
      questionsPromises = words.map((word) => getQuestions(word.word_id, questionIds, false));
    } else {
      questionsPromises = words.map((word) => getQuestions(word.word_id, word.questionIds, false));
    }
    const questionsResults: QuestionData[][] = await Promise.all(questionsPromises);
    const questions: QuestionData[] = shuffleArray(questionsResults.flat());
    const finalCount = Math.min(questions.length, count);
    const wordToQuestionMap = new Map<string, WordQuestionMap>();
    for (let i = 0; i < finalCount; i++) {
      const question = questions[i];
      let wordQuestions = wordToQuestionMap.get(question.word_id);
      if (!wordQuestions) {
        const wordData = words.find((word) => word.word_id === question.word_id);
        wordQuestions = {
          wordID: question.word_id,
          progress: wordData?.progress || 0,
          questionIds: [],
        };
        wordToQuestionMap.set(question.word_id, wordQuestions);
      }
      wordQuestions.questionIds.push(question.id ?? '');
      wordQuestions.progress += 1;

      if (question.type === 'image') {
        const foundWord = words.find((wordObj) => wordObj.word_id === question.word_id);
        if (foundWord) {
          question.image = foundWord.image;
        }
      }
      question.options = await getOptions(question.options);
      gameArray.push(
        createGameScreen(
          `${ALL_CONSTANT.QUESTIONS_SMALL}-${question.word_id}-${question.id}`,
          question,
        ),
      );
    }
    addQuestionsBatch(user.uid, wordToQuestionMap, batch);
    return gameArray;
  } catch (error) {
    bugsnagErrorHandler(error, 'pages/dashboard/hooks/useQuestions.ts/getRandomQuestions', {
      user,
      count,
      isLearnt,
      questionIds,
    });
    return gameArray;
  }
};

export default getRandomQuestions;
