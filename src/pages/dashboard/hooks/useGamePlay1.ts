import { useEffect } from 'react';
import { GameScreen, User } from 'types';
import { useAppDispatch } from 'store/hooks';
import { commitBatch, getBatch, getUserData, updateProgress } from 'database/shabadavalidb';
import { addScreens } from 'store/features/gameArraySlice';
import { fetchProgress, gameAlgo } from '../utils';
import { bugsnagErrorHandler } from 'utils';
import { WriteBatch } from 'firebase/firestore';

const useGamePlay = (
  user: User,
  currentProgress: number,
  currentLevel: number,
  toggleLoading: (value: boolean) => void,
  resetGame = true,
) => {
  const dispatch = useAppDispatch();

  const gamePlay = async (batch: WriteBatch) => {
    const userData = await getUserData(user.uid);
    if (!userData) {
      const gameArray: GameScreen[] = [];
      return { gameArray };
    }
    const progress: GameScreen[] | null = fetchProgress(userData);
    if (progress && progress.length > 0) {
      const gameArray: GameScreen[] = progress;
      return { gameArray };
    }
    const { gameArray } = await gameAlgo(user, batch);
    return { gameArray };
  };

  useEffect(() => {
    const fetchGamePlay = async () => {
      if (user.progress) {
        try {
          const batch = getBatch();
          const { gameArray = [] } = await gamePlay(batch);
          updateProgress(user.uid, currentProgress, gameArray, currentLevel, batch);
          await commitBatch(batch);
          dispatch(addScreens(gameArray));
        } catch (error) {
          bugsnagErrorHandler(error, 'pages/dashboard/hooks/useGamePlay1.ts/useGamePlay', {
            ...user,
          });
        }
      }
      toggleLoading(false);
    };
    if (resetGame === true) {
      fetchGamePlay();
    }
  }, [user.progress, resetGame]);
};

export default useGamePlay;
