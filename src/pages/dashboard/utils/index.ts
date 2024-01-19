import { GameScreen, User } from 'types/shabadavlidb';
import { getRandomQuestion } from 'database/default/question';
import ALL_CONSTANT from 'constants/constant';

export const operations = [
  'Definition',
  'learning',
  'learning',
  'learning',
  'learning',
  'learning',
  'learning',
  'learning',
  'learning',
  'learnt',
  'learnt',
  'learnt',
];

export const getRandomElement = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const removedElement = array.splice(randomIndex, 1)[0];
  return removedElement;
};

export const getRandomWordFromArray = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const createGameScreen = (key: string, data: any): GameScreen => {
  return { key, data };
};

export const checkIsFirstTime = (user: User) => {
  return (
    user?.coins === 0 &&
    user?.progress.currentLevel === 0 &&
    user?.progress.currentProgress === 0 &&
    user?.progress.gameSession.length === 0
  );
};
export const fetchProgress = (user: User) => {
  return user?.progress.gameSession.length > 0
    ? user.progress.gameSession
    : null;
};

export const addQuestionToGameArray = async (wordArray: string[]) => {
  const wordID = getRandomWordFromArray(wordArray);
  const question = await getRandomQuestion(wordID);

  if (question) {
    return createGameScreen(
      `${ALL_CONSTANT.QUESTIONS_SMALL}-${wordID}-${question.id}`,
      question,
    );
  }
};
