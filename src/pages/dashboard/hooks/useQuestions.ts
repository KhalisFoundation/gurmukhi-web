import { User, GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { addQuestionsBatch, getWords } from 'database/shabadavalidb';
import { createGameScreen, shuffleArray } from '../utils';
import ALL_CONSTANT from 'constants/constant';
import { getQuestions } from 'database/default';
import { QuestionData } from 'types';
import { bugsnagErrorHandler } from 'utils';

const getRandomQuestions = async (
  user: User,
  count: number,
  isLearnt: boolean,
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
      questionsPromises = words.map((word) => getQuestions(word.word_id, questionIds));
    } else {
      questionsPromises = words.map((word) => getQuestions(word.word_id, word.questionIds));
    }
    const questionsResults: QuestionData[][] = await Promise.all(questionsPromises);
    const questions: QuestionData[] = shuffleArray(questionsResults.flat());
    const finalCount = Math.min(questions.length, count);
    const wordToQuestionMap = new Map<string, string[]>();
    for (let i = 0; i < finalCount; i++) {
      const question = questions[i];
      const wordQuestions = wordToQuestionMap.get(question.word_id) || [];
      wordQuestions.push(question.id ?? '');
      wordToQuestionMap.set(question.word_id, wordQuestions);
      if (question.type === 'image') {
        const foundWord = words.find((wordObj) => wordObj.word_id === question.word_id);
        if (foundWord) {
          question.image = foundWord.image;
        }
      }
      gameArray.push(
        createGameScreen(
          `${ALL_CONSTANT.QUESTIONS_SMALL}-${question.word_id}-${question.id}`,
          question,
        ),
      );
    }
    await addQuestionsBatch(user.uid, wordToQuestionMap);
    return gameArray;
  } catch (error) {
    bugsnagErrorHandler(
      error,
      'pages/dashboard/hooks/useQuestions.ts/getRandomQuestions',
      { user, count, isLearnt, questionIds },
    );
    return gameArray;
  }
};

export default getRandomQuestions;
