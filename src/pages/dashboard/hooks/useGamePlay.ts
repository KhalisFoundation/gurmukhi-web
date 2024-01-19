import { useEffect } from 'react';
import { User, GameScreen } from 'types/shabadavlidb';
import { addWordIDs } from 'store/features/learningWordSlice';
import { addScreens } from 'store/features/gameArraySlice';
import { useAppDispatch } from 'store/hooks';
import ALL_CONSTANT from 'constants/constant';
import { getRandomWord } from 'database/default';
import { updateProgress } from 'database/shabadavalidb';
import { getQuestionsByWordID } from 'database/default/question';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { setCurrentLevel } from 'store/features/currentLevelSlice';
import {
  getRandomElement,
  operations,
  createGameScreen,
  fetchProgress,
  checkIsFirstTime,
  addQuestionToGameArray,
} from '../utils';

const useGamePlay = (user: User, toggleLoading: (value: boolean) => void) => {
  const dispatch = useAppDispatch();

  const gamePlay = async () => {
    let gameArray: GameScreen[] = [];
    const learningWords: string[] = [];
    const learntWords: string[] = [];
    const progress: GameScreen[] | null = fetchProgress(user);

    const addWordIfNotExists = (wordID: string) => {
      if (!learningWords.includes(wordID)) {
        learningWords.push(wordID);
      }
    };
    const addWordQuestions = async (count: number) => {
      const word = await getRandomWord();
      if (word?.id) {
        const questions = await getQuestionsByWordID(word.id, true);
        addWordIfNotExists(word.id);
        gameArray.push(
          createGameScreen(`${ALL_CONSTANT.DEFINITION}-${word.id}`, word),
        );
        gameArray.push(
          createGameScreen(`${ALL_CONSTANT.SENTENCES}-${word.id}`, word),
        );
        for (let j = 0; j < questions.length; j++) {
          gameArray.push(
            createGameScreen(
              `${ALL_CONSTANT.QUESTIONS_SMALL}-${word.id}-${questions[j].id}`,
              questions[j],
            ),
          );
          count += 1;
        }
      }
      return count;
    };

    if (checkIsFirstTime(user)) {
      console.log('its running frist time');
      let i = 0;
      while (i < ALL_CONSTANT.LEVELS_COUNT) {
        try {
          i = await addWordQuestions(i);
        } catch (error) {
          console.error('Error fetching random word:', error);
        }
      }
      updateProgress(user.uid, 0, gameArray, 0);
    } else if (progress && progress?.length > 0) {
      gameArray = progress;
      dispatch(setCurrentGamePosition(user?.progress.currentProgress));
      dispatch(setCurrentLevel(user?.progress.currentLevel));
    } else {
      console.log('Else running');
      const totalLength = operations.length;
      let current = 0;
      let questionCount = 0;
      while (
        current < totalLength &&
        questionCount < ALL_CONSTANT.LEVELS_COUNT
      ) {
        const randomElement = getRandomElement(operations);
        console.log('Random Element', randomElement);
        console.log('current', current);
        switch (randomElement) {
          case 'learning':
            const learningQuestion = await addQuestionToGameArray(
              learningWords,
            );
            if (learningQuestion) {
              questionCount += 1;
              gameArray.push(learningQuestion);
            }
            break;
          case 'learnt':
            const learntQuestion = await addQuestionToGameArray(learntWords);
            if (learntQuestion) {
              questionCount += 1;
              gameArray.push(learntQuestion);
            }
            break;
          case 'Definition':
            questionCount = await addWordQuestions(questionCount);
            break;
        }
        current += 1;
      }
      updateProgress(user.uid, 0, gameArray, 0);
    }

    return { learningWords, gameArray };
  };
  useEffect(() => {
    const fetchGamePlay = async () => {
      if (user.progress) {
        try {
          toggleLoading(true);
          const { learningWords, gameArray } = await gamePlay();
          dispatch(addWordIDs(learningWords));
          dispatch(addScreens(gameArray));
          toggleLoading(false);
        } catch (error) {
          console.error('Error in Game Play Algo', error);
        }
      }
    };
    fetchGamePlay();
  }, [user]);
};
export default useGamePlay;
