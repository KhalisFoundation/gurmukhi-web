import { User } from 'types/shabadavalidb';
import { GameScreen } from 'types/shabadavalidb';
import { fetchProgress } from '../utils';
import { useAppDispatch } from 'store/hooks';
import { getUserData } from 'database/shabadavalidb';
import { useEffect } from 'react';
import { gameAlgo } from '../utils';
import { setProgress, updateUserProgress } from 'store/features/progressSlice';

const useGamePlay = (user: User, toggleLoading: (value: boolean) => void, resetGame = true) => {
  const dispatch = useAppDispatch();

  const gamePlay = async () => {
    const userData: any = await getUserData(user.uid);

    if (!userData) {
      const gameArray: GameScreen[] = [];
      return { gameArray };
    }
    const gameSession: GameScreen[] | null = await fetchProgress(userData);
    if (gameSession && Array.isArray(gameSession) && gameSession.length > 0) {
      const gameArray: GameScreen[] | null = gameSession;
      const currentProgress = userData?.progress.currentProgress || 0;
      const currentLevel = userData?.progress.currentLevel || 0;
      dispatch(setProgress(userData));
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
            dispatch(updateUserProgress({ uid: user.uid, currentProgress, gameArray, currentLevel }));
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
  }, [user.progress, resetGame]);
};

export default useGamePlay;
