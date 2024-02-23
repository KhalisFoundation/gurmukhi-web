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

export const getRandomElement = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const removedElement = array.splice(randomIndex, 1)[0];
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
    user?.coins === 0 &&
    user?.progress.currentLevel === 0 &&
    user?.progress.currentProgress === 0 &&
    user?.progress.gameSession.length === 0
  );
};

export const fetchProgress = (user: any) => {
  return user?.progress.gameSession.length > 0 ? user.progress.gameSession : null;
};

export const shuffleArray = (array: GameScreen[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const gameAlgo = async (user: User) => {
  let learningCount = 9;
  let learntCount = 2;
  let newQuestionCount = 2;
  const learningQuestions = await getRandomQuestions(user, learningCount, false);
  if (learningQuestions.length < learningCount) {
    learntCount += learningCount - learningQuestions.length;
    learningCount = learningQuestions.length;
  }
  const learntQuestions = await getRandomQuestions(user, learntCount, true);

  if (learntQuestions.length < learntCount) {
    newQuestionCount += learntCount - learntQuestions.length;
    learntCount = learntQuestions.length;
  }
  const { game, learningWords } = await getNewQuestions(newQuestionCount);
  let gameArray: GameScreen[] = [];
  if (learntCount === 0 && learningCount === 0) {
    gameArray = game as GameScreen[];
  } else {
    const combinedArrays = [...learningQuestions, ...learntQuestions];
    gameArray = shuffleArray(combinedArrays);
    gameArray = [...gameArray, ...game];
  }

  if (learningWords.length > 0) {
    await addWordsBatch(user.uid, learningWords);
  }
  return { gameArray };
};
