import { updateNextSession } from 'database/shabadavalidb';
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
    const { gameArray } = await gameAlgo(user);
    bugsnagErrorHandler(new Error('Game Algo at Webworker'), 'web worker', gameArray, user, 'info');
    dispatch(addNextScreens(gameArray));
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
