import { GameScreen, User } from 'types';
import getRandomQuestions from '../hooks/useQuestions';
import getNewQuestions from '../hooks/useNew';
import { addWordsBatch } from 'database/shabadavalidb';
import {
  shuffleArray,
  createGameScreen,
  fetchProgress,
  checkIsFirstTime,
} from './helpers';
import CONSTANTS from 'constants/constant';

const gameAlgo = async (user: User) => {
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

export {
  gameAlgo,
  shuffleArray,
  createGameScreen,
  fetchProgress,
  checkIsFirstTime,
};
