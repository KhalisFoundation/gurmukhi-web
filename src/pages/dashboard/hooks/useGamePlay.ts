import { useEffect } from 'react';
import { GameScreen, ProgressData, User } from 'types';
import { useAppDispatch } from 'store/hooks';
import { commitBatch, getBatch, updateProgress } from 'database/shabadavalidb';
import { addScreens } from 'store/features/gameArraySlice';
import { gameAlgo } from '../utils';
import { bugsnagErrorHandler } from 'utils';
import { WriteBatch } from 'firebase/firestore';
import { setUserProgress } from 'store/features/userDataSlice';

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
    if (gameSession && gameSession.length > 0) {
      return { gameArray: gameSession };
    }
    const { gameArray } = await gameAlgo(user, batch);
    return { gameArray };
  };

  useEffect(() => {
    const fetchGamePlay = async () => {
      if (gameSession && resetGame) {
        try {
          const batch = getBatch();
          const { gameArray = [] } = await gamePlay(batch);
          await updateProgress(user.uid, currentProgress, gameArray, currentLevel, batch);
          await commitBatch(batch);
          dispatch(addScreens(gameArray));
          dispatch(setUserProgress({
            ...user,
            progress: {
              currentLevel,
              currentProgress,
              gameSession: gameArray,
            },
          } as ProgressData));
        } catch (error) {
          bugsnagErrorHandler(error, 'pages/dashboard/hooks/useGamePlay.ts/useGamePlay', {
            ...user,
          });
        } finally {
          toggleLoading(false);
        }
      } else {
        toggleLoading(false);
      }
    };
    fetchGamePlay();
  }, [resetGame]);
};

export default useGamePlay;
