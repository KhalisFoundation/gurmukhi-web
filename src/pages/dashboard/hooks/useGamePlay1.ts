import { User, WordShabadavaliDB } from 'types/shabadavalidb';
import { GameScreen } from 'types/shabadavalidb';
import { fetchProgress, shuffleArray } from '../utils';
import { useAppDispatch } from 'store/hooks';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { setCurrentLevel } from 'store/features/currentLevelSlice';
import { updateProgress } from 'database/shabadavalidb';
import { useEffect } from 'react';
import { addScreens } from 'store/features/gameArraySlice';
import useNew from './useNew';
import useQuestions from './useQuestions';
import { addWordsBatch } from 'database/shabadavalidb';

const useGamePlay = (user: User, toggleLoading: (value: boolean) => void, resetGame = true) => {
  const dispatch = useAppDispatch();
  const getRandomQuestions = useQuestions(user);
  const getNewQuestions = useNew();
  const inProgressWords:WordShabadavaliDB[] = [];
  
  const gamePlay = async () => {
    const progress: GameScreen[] | null = fetchProgress(user);
    if (progress && progress.length > 0) {
      const gameArray = progress;
      dispatch(setCurrentGamePosition(user?.progress.currentProgress));
      dispatch(setCurrentLevel(user?.progress.currentLevel));
      return { gameArray };
    }

    let learningCount = 9;
    let learntCount = 2;
    let newQuestionCount = 2;
    const learningQuestions = await getRandomQuestions(learningCount, false);
    if (learningQuestions.length < learningCount) {
      learntCount += learningCount - learningQuestions.length;
      learningCount = learningQuestions.length;
    }
    const learntQuestions = await getRandomQuestions(learntCount, true);

    if (learntQuestions.length < learntCount) {
      newQuestionCount += learntCount - learntQuestions.length;
      learntCount = learntQuestions.length;
    }
    const { game, learningWords } = await getNewQuestions(newQuestionCount, inProgressWords);
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
    await updateProgress(user.uid, 0, gameArray, 0);
    return { gameArray };
  };

  useEffect(() => {
    const fetchGamePlay = async () => {
      if (user.progress) {
        try {
          toggleLoading(true);
          const { gameArray } = await gamePlay();
          if (gameArray) {
            dispatch(addScreens(gameArray));
          }
          toggleLoading(false);
        } catch (error) {
          console.error('Error in Game Play Algo', error);
        }
      }
    };
    if (resetGame === true) {
      fetchGamePlay();
    }
  }, [user, resetGame]);
};

export default useGamePlay;
