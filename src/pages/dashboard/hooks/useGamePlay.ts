import { useEffect } from 'react';
import { GameScreen, User } from 'types';
import { useAppDispatch } from 'store/hooks';
import { commitBatch, getBatch, updateProgress } from 'database/shabadavalidb';
import { addScreens } from 'store/features/gameArraySlice';
import { gameAlgo } from '../utils';
import { bugsnagErrorHandler } from 'utils';
import { WriteBatch } from 'firebase/firestore';
import { setUserData } from 'store/features/userDataSlice';

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
      if (gameSession) {
        try {
          const batch = getBatch();
          const { gameArray = [] } = await gamePlay(batch);
          updateProgress(user.uid, currentProgress, gameArray, currentLevel, batch);
          await commitBatch(batch);
          dispatch(addScreens(gameArray));
          dispatch(
            setUserData({ ...user, progress: { ...user.progress, gameSession: gameArray } }),
          );
        } catch (error) {
          bugsnagErrorHandler(error, 'pages/dashboard/hooks/useGamePlay.ts/useGamePlay', {
            ...user,
          });
        }
      }
      toggleLoading(false);
    };
    if (resetGame === true) {
      fetchGamePlay();
    } else {
      toggleLoading(false);
    }
  }, [resetGame]);
};

export default useGamePlay;
