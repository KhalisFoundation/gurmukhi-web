import {
  GameScreen,
  User,
  WordShabadavaliDB,
} from 'types/shabadavalidb';
import { QuestionData } from 'types';
import { WordType } from 'types';
import getRandomQuestions from '../hooks/useQuestions';
import getNewQuestions from '../hooks/useNew';
import { addWordsBatch } from 'database/shabadavalidb';
import CONSTANTS from 'constants/constant';

export const getRandomElement = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const removedElement = array.splice(randomIndex, CONSTANTS.DEFAULT_ONE)[0];
  return removedElement;
};

export const getRandomWordFromArray = (array: WordShabadavaliDB[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const createGameScreen = (key: string, data: QuestionData | WordType): GameScreen => {
  return { key, data };
};

export const checkIsFirstTime = (user: User) => {
  return (
    user?.progress.currentLevel === 0 &&
    user?.progress.currentProgress === 0 &&
    user?.progress.gameSession.length === 0
  );
};

export const fetchProgress = (user: User) => {
  const gameSession = user?.progress.gameSession;
  return gameSession && gameSession.length > 0 ? gameSession : null;
};

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - CONSTANTS.DEFAULT_ONE; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + CONSTANTS.DEFAULT_ONE));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const gameAlgo = async (user: User) => {
  const isFirstTime = checkIsFirstTime(user);
  if (user && isFirstTime) {
    const { game, learningWords } = await getNewQuestions(CONSTANTS.LEVELS_COUNT, true);
    const gameArray: GameScreen[] = game;

    if (learningWords.length > 0) {
      await addWordsBatch(user.uid, learningWords);
    }
    return { gameArray };
  }
  let learningCount = CONSTANTS.DEFAULT_LEARNING_COUNT;
  let newQuestionCount = CONSTANTS.DEFAULT_NEW_COUNT;
  let learntCount = CONSTANTS.DEFAULT_LEARNT_COUNT;
  const learningQuestions = await getRandomQuestions(user, learningCount, false);
  if (learningQuestions.length < learningCount) {
    newQuestionCount += learningCount - learningQuestions.length;
    learningCount = learningQuestions.length;
  }

  const learntQuestions = await getRandomQuestions(user, learntCount, true);
  if (learntQuestions.length < learntCount) {
    newQuestionCount += learntCount - learntQuestions.length;
    learntCount = learntQuestions.length;
  }

  const { game: newQuestions, learningWords } = await getNewQuestions(
    newQuestionCount,
    false,
    user.uid,
  );

  let gameArray: GameScreen[] = [];
  if (learntCount === 0 && learningCount === 0) {
    gameArray = newQuestions as GameScreen[];
  } else {
    const combinedArrays = [
      ...shuffleArray(learningQuestions),
      ...newQuestions,
      ...shuffleArray(learntQuestions),
    ];
    gameArray = [...combinedArrays];
  }

  if (learningWords.length > 0) {
    await addWordsBatch(user.uid, learningWords);
  }
  return { gameArray };
};
