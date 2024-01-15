import ALL_CONSTANT from 'constants/constant';
import { getQuestionsByWordID } from 'database/question';
import { getRandomWord } from './database';

type User = {
  progress: {
    gameSession: string[];
    currentLevel: number;
    currentProgress: number;
  };
};

const TOTAL_LEVEL = 13;
const fetchProgress = (user: User) => {
  return user?.progress.gameSession.length > 0 ? user.progress.gameSession : null;
};

const gamePlay = async (user: User) => {
  const gameArray: string[] = [];
  const learningWords: string[] = [];
  const progress = fetchProgress(user);

  const addWordIfNotExists = (wordID: string) => {
    if (!learningWords.includes(wordID)) {
      learningWords.push(wordID);
    }
  };

  if (!progress) {
    let i = 0;
    while (i < TOTAL_LEVEL) {
      try {
        const word = await getRandomWord();
        if (word?.id) {
          const questions = await getQuestionsByWordID(word.id);
          addWordIfNotExists(word.id);
          gameArray.push(`${ALL_CONSTANT.DEFINITION}-${word.id}`);
          gameArray.push(`${ALL_CONSTANT.SENTENCES}-${word.id}`);
          for (let j = 0; j < questions.length; j++) {
            gameArray.push(`${ALL_CONSTANT.QUESTIONS_SMALL}-${word.id}-${questions[j].id}`);
            i += 1;
          }
        }
      } catch (error) {
        console.error('Error fetching random word:', error);
      }
    }
  }
  console.log('GameArray', gameArray);

  return { learningWords, gameArray };
};

export default gamePlay;
