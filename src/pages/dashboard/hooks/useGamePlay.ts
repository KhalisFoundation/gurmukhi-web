import { useEffect } from 'react';
import { GameScreen, ProgressData, User } from 'types';
import { useAppDispatch } from 'store/hooks';
import { commitBatch, getBatch, updateProgress } from 'database/shabadavalidb';
import { addScreens } from 'store/features/gameArraySlice';
import { gameAlgo } from '../utils';
import { bugsnagErrorHandler } from 'utils';
import { WriteBatch } from 'firebase/firestore';
import { updateUserData } from 'store/features/userDataSlice';
import { fetchProgress } from '../utils';

const useGamePlay = (
  user: User,
  currentProgress: number,
  currentLevel: number,
  gameSession: GameScreen[],
  toggleLoading: (value: boolean) => void,
  resetGame = true,
) => {
  const dispatch = useAppDispatch();

  const gamePlay = async (batch: WriteBatch) => {
    const progress: GameScreen[] | null = fetchProgress(user);
    if (progress && progress.length > 0) {
      const gameArray: GameScreen[] = progress;
      return { gameArray };
    }
    const { gameArray } = await gameAlgo(user, batch);
    return { gameArray };
  };

  useEffect(() => {
    const fetchGamePlay = async () => {
      try {
        const batch = getBatch();
        const { gameArray = [] } = await gamePlay(batch);
        await updateProgress(user.uid, currentProgress, gameArray, currentLevel, batch);
        await commitBatch(batch);
        dispatch(addScreens(gameArray));
        dispatch(
          updateUserData({
            ...user,
            progress: {
              currentLevel,
              currentProgress,
              gameSession: gameArray,
            },
          } as ProgressData),
        );
      } catch (error) {
        bugsnagErrorHandler(error, 'pages/dashboard/hooks/useGamePlay.ts/useGamePlay', {
          ...user,
        });
      } finally {
        toggleLoading(false);
      }
    };
    if (resetGame === true) {
      fetchGamePlay();
    }
  }, [resetGame]);
};

export default useGamePlay;
