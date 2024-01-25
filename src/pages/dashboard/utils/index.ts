import {
  GameScreen,
  QuestionType,
  User,
  WordShabadavaliDB,
} from 'types/shabadavlidb';
// import { getRandomQuestion } from 'database/default/question';
// import ALL_CONSTANT from 'constants/constant';
import { QuestionData } from 'types';
import { WordType } from 'types';

export const getRandomElement = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const removedElement = array.splice(randomIndex, 1)[0];
  return removedElement;
};

export const getRandomWordFromArray = (array: WordShabadavaliDB[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const createGameScreen = (
  key: string,
  data: QuestionData | WordType | QuestionType,
): GameScreen => {
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
