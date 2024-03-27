import { GameScreen, User } from 'types/shabadavalidb';
import getRandomQuestions from '../hooks/useQuestions';
import getNewQuestions from '../hooks/useNew';
import { addWordsBatch } from 'database/shabadavalidb';
import {
  shuffleArray,
  getRandomElement,
  getRandomWordFromArray,
  createGameScreen,
  fetchProgress,
  checkIsFirstTime,
} from './helpers';


const gameAlgo = async (user: User) => {
  const isFirstTime = checkIsFirstTime(user);
  if (user && isFirstTime) {
    const { game, learningWords } = await getNewQuestions(13, true);
    const gameArray: GameScreen[] = game;

    if (learningWords.length > 0) {
      await addWordsBatch(user.uid, learningWords);
    }
    return { gameArray };
  }
  let learningCount = 9;
  let newQuestionCount = 2;
  let learntCount = 2;
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
  getRandomElement,
  gameAlgo,
  getRandomWordFromArray,
  shuffleArray,
  createGameScreen,
  fetchProgress,
  checkIsFirstTime,
};
