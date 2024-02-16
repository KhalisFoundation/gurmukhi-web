import { User } from 'types/shabadavalidb';
import { GameScreen } from 'types/shabadavalidb';
import { fetchProgress } from '../utils';
import { useAppDispatch } from 'store/hooks';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { setCurrentLevel } from 'store/features/currentLevelSlice';
import { useEffect } from 'react';

const useGamePlay = (user: User, toggleLoading: (value: boolean) => void, resetGame = true) => {
  const dispatch = useAppDispatch();

  const gamePlay = async () => {
    const progress: GameScreen[] | null = fetchProgress(user);
    if (progress && progress.length > 0) {
      const gameArray = progress;
      dispatch(setCurrentGamePosition(user?.progress.currentProgress));
      dispatch(setCurrentLevel(user?.progress.currentLevel));
      return { gameArray };
    }
  };

  useEffect(() => {
    const fetchGamePlay = async () => {
      if (user.progress) {
        try {
          toggleLoading(true);
          // const { gameArray } = await gamePlay(5);
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
