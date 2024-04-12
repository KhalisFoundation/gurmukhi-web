import { gameAlgo } from 'pages/dashboard/utils';
import { User } from 'types/shabadavalidb';
import { updateNextSession } from 'database/shabadavalidb';
import { bugsnagErrorHandler } from 'utils';
import { setScreens } from 'store/features/gameArraySlice';

export const fetchNextSessionData = async (usr: User, dispatch: any, setWebWorker: any) => {
  try {
    const nextSession = usr?.nextSession ?? [];
    if (nextSession.length > 0) {
      dispatch(setWebWorker(false));
      return;
    }
    const { gameArray } = await gameAlgo(usr);
    bugsnagErrorHandler(
      new Error('Game Algo at Webworker'),
      'web worker',
      gameArray,
      usr,
      'info',
    );
    await updateNextSession(usr.uid, gameArray);
    dispatch(setScreens(gameArray));
    dispatch(setWebWorker(false));
  } catch (error: any) {
    dispatch(setWebWorker(false));
    bugsnagErrorHandler({
      ...error,
      location: 'src/utils/webWorker.ts/fetchNextSessionData',
    },
    'web worker', {}, usr);
  }
};
