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
      dispatch(setCurrentGamePosition(userData?.progress.currentProgress));
      dispatch(setCurrentLevel(userData?.progress.currentLevel));
      return { gameArray };
    }
    const { gameArray } = await gameAlgo(user);
    return { gameArray };
  };

  useEffect(() => {
    const fetchGamePlay = async () => {
      if (user.progress) {
        try {
          toggleLoading(true);
          const { gameArray } = await gamePlay();
          if (gameArray) {
            await updateProgress(user.uid, 0, gameArray, 0, toggleLoading);
            dispatch(addScreens(gameArray));
          }
        } catch (error) {
          console.error('Error in Game Play Algo', error);
        } finally {
          toggleLoading(false);
        }
      }
    };
    if (resetGame === true) {
      fetchGamePlay();
    }
  }, [user.progress, resetGame]);
};

export default useGamePlay;
