import { updateNextSession } from 'database/shabadavalidb';
import { gameAlgo } from 'pages/dashboard/utils';
import { setWebWorker } from 'store/features/webWorkerSlice';
import { AppDispatch } from 'store/store';
import { User } from 'types';
import { bugsnagErrorHandler } from 'utils';

export const fetchNextSessionData = async (
  user: User,
  dispatch: AppDispatch,
) => {
  try {
    const nextSession = user?.nextSession ?? [];
    if (nextSession.length > 0) {
      dispatch(setWebWorker(false));
      return;
    }
    const { gameArray } = await gameAlgo(user);
    bugsnagErrorHandler(new Error('Game Algo at Webworker'), 'web worker', gameArray, user, 'info');
    await updateNextSession(user.uid, gameArray);
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
