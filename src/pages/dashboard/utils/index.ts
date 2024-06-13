import { GameScreen, SentenceWord, User, WordType } from 'types';
import getRandomQuestions from '../hooks/useQuestions';
import getNewQuestions from '../hooks/useNew';
import { addWordsBatch } from 'database/shabadavalidb';
import { shuffleArray, createGameScreen, fetchProgress, checkIsFirstTime } from './helpers';
import CONSTANTS from 'constants/constant';
import { WriteBatch } from 'firebase/firestore';

const gameAlgo = async (user: User, batch: WriteBatch) => {
  const isFirstTime = checkIsFirstTime(user);
  if (user && isFirstTime) {
    const { game, learningWords } = await getNewQuestions(CONSTANTS.LEVELS_COUNT, true);
    const gameArray: GameScreen[] = game;

    if (learningWords.length > 0) {
      await addWordsBatch(user.uid, learningWords, batch);
    }
    return { gameArray };
  }
  let learningCount = CONSTANTS.DEFAULT_LEARNING_COUNT;
  let newQuestionCount = CONSTANTS.DEFAULT_NEW_COUNT;
  let learntCount = CONSTANTS.DEFAULT_LEARNT_COUNT;
  const learningQuestions = await getRandomQuestions(user, learningCount, false, batch);
  if (learningQuestions.length < learningCount) {
    newQuestionCount += learningCount - learningQuestions.length;
    learningCount = learningQuestions.length;
  }

  const learntQuestions = await getRandomQuestions(user, learntCount, true, batch);
  if (learntQuestions.length < learntCount) {
    newQuestionCount += learntCount - learntQuestions.length;
    learntCount = learntQuestions.length;
  }

  const { game, learningWords } = await getNewQuestions(newQuestionCount, false, user.uid);

  let gameArray: GameScreen[] = [];
  if (learntCount === 0 && learningCount === 0) {
    gameArray = game as GameScreen[];
  } else {
    const combinedArrays = [
      ...shuffleArray(learningQuestions),
      ...game,
      ...shuffleArray(learntQuestions),
    ];
    gameArray = [...combinedArrays];
  }

  if (learningWords.length > 0) {
    await addWordsBatch(user.uid, learningWords, batch);
  }
  return { gameArray };
};

const getRandomWord = (gameArray: GameScreen[]): WordType | null => {
  if (gameArray.length === 0) {
    return null;
  }
  const filteredArray = gameArray.filter((item) => item.key.includes('definition'));
  const randomIndex = Math.floor(Math.random() * filteredArray.length);
  const wordId = filteredArray[randomIndex].key.split('-')[1];
  const sentences = gameArray.filter((item) => item.key.includes('sentence') && item.key.includes(wordId))[0].data as SentenceWord;
  const sentencesArray = sentences.sentences.map((sentence) => {
    return {
      'sentence': sentence.sentence,
      'translation': sentence.translation ?? '',
    } as {
      sentence: string;
      translation: string;
      audioURL?: string;
    };
  });
  const randomWord = filteredArray[randomIndex].data;
  return {
    id: wordId,
    ...randomWord,
    sentences: sentencesArray,
  } as WordType;
};

export {
  gameAlgo,
  shuffleArray,
  createGameScreen,
  fetchProgress,
  checkIsFirstTime,
  getRandomWord,
};
