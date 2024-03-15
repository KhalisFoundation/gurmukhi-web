import { User, GameScreen } from 'types/shabadavalidb';
import { addQuestionsBatch, getWordsFromUser } from 'database/shabadavalidb';
import { createGameScreen } from '../utils';
import ALL_CONSTANT from 'constants/constant';
import { getQuestionsByWordID } from 'database/default';
import { QuestionData } from 'types';

async function getRandomQuestions(
  user: User,
  count: number,
  isLearnt: boolean,
): Promise<GameScreen[]> {
  let words = await getWordsFromUser(user.uid, count, isLearnt);

  if (words.length === 0) {
    words = await getWordsFromUser(user.uid, count, !isLearnt);
  }
  if (words.length === 0) return [];
  const questionCount = isLearnt ? 1 : 2;
  const questionPromises = words.map((word) =>
    getQuestionsByWordID(word.word_id, questionCount, isLearnt, true, word.questionIds),
  );

  const questionsResults: QuestionData[][] = await Promise.all(questionPromises);
  const questions = questionsResults.flat();

  const finalCount = Math.min(questions.length, count);
  const gameScreens: GameScreen[] = [];
  const wordToQuestionMap: Map<string, string[]> = new Map();

  for (let i = 0; i < finalCount; i++) {
    const question = questions[i];
    const existingQuestions = wordToQuestionMap.get(question.word_id) || [];
    existingQuestions.push(question.id ?? '');
    wordToQuestionMap.set(question.word_id, existingQuestions);

    if (question.type === 'image') {
      const foundWord = words.find((wordObj) => wordObj.word_id === question.word_id);
      question.image = foundWord?.image ?? question.image;
    }

    gameScreens.push(
      createGameScreen(
        `${ALL_CONSTANT.QUESTIONS_SMALL}-${question.word_id}-${question.id}`,
        question,
      ),
    );
  }
  await addQuestionsBatch(user.uid, wordToQuestionMap);

  return gameScreens;
}

export default getRandomQuestions;
