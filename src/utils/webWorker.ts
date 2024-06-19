import { commitBatch, getBatch, updateNextSession } from 'database/shabadavalidb';
import { gameAlgo } from 'pages/dashboard/utils';
import { addNextScreens } from 'store/features/nextSessionSlice';
import { setWebWorker } from 'store/features/webWorkerSlice';
import { AppDispatch } from 'store/store';
import { GameScreen, User } from 'types';
import { bugsnagErrorHandler } from 'utils';

export const fetchNextSessionData = async (
  user: User,
  nextSession: GameScreen[],
  dispatch: AppDispatch,
) => {
  try {
    if (nextSession.length > 0) {
      dispatch(setWebWorker(false));
      return;
    }
    const batch = getBatch();
    const { gameArray } = await gameAlgo(user, batch);
    bugsnagErrorHandler(new Error('Game Algo at Webworker'), 'web worker', gameArray, user, 'info');
    dispatch(addNextScreens(gameArray));
    updateNextSession(user.uid, gameArray, batch);
    await commitBatch(batch);
    dispatch(setWebWorker(false));
  } catch (error) {
    dispatch(setWebWorker(false));
    bugsnagErrorHandler(
      {
        error,
        location: 'src/utils/webWorker.ts/fetchNextSessionData',
      },
      'web worker',
      {},
      user,
    );
  }
};
