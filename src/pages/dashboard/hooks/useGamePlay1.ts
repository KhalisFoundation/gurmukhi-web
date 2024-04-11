import { User } from 'types/shabadavalidb';
import { GameScreen } from 'types/shabadavalidb';
import { fetchProgress } from '../utils';
import { useAppDispatch } from 'store/hooks';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { setCurrentLevel } from 'store/features/currentLevelSlice';
import { getUserData, updateProgress } from 'database/shabadavalidb';
import { useEffect } from 'react';
import { addScreens } from 'store/features/gameArraySlice';
import { gameAlgo } from '../utils';
import { bugsnagErrorHandler } from 'utils';

const useGamePlay = (user: User, toggleLoading: (value: boolean) => void, resetGame = true) => {
  const dispatch = useAppDispatch();

  const gamePlay = async () => {
    const userData: any = await getUserData(user.uid);

    if (!userData) {
      const gameArray: GameScreen[] = [];
      return { gameArray };
    }
    const progress: GameScreen[] | null = await fetchProgress(userData);
    if (progress && progress.length > 0) {
      const gameArray: GameScreen[] | null = progress;
      const currentProgress = userData?.progress.currentProgress || 0;
      const currentLevel = userData?.progress.currentLevel || 0;
      dispatch(setCurrentGamePosition(currentProgress));
      dispatch(setCurrentLevel(currentLevel));
      return { currentProgress, currentLevel, gameArray };
    }
    const { gameArray } = await gameAlgo(user);
    return { currentProgress: 0, currentLevel: 0, gameArray };
  };

  useEffect(() => {
    const fetchGamePlay = async () => {
      if (user.progress) {
        try {
          toggleLoading(true);
          const { currentProgress, currentLevel, gameArray } = await gamePlay();
          if (gameArray) {
            await updateProgress(user.uid, currentProgress, gameArray, currentLevel);
            dispatch(addScreens(gameArray));
          }
          toggleLoading(false);
        } catch (error) {
          bugsnagErrorHandler(error,
            'pages/dashboard/hooks/useGamePlay1.ts/useGamePlay',
            { ...user },
          );
        }
      }
    };
    if (resetGame === true) {
      fetchGamePlay();
    }
  }, [user.progress, resetGame]);
};

export default useGamePlay;
