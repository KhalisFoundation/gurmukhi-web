import { gameAlgo } from 'pages/dashboard/utils';
import { User } from 'types/shabadavalidb';
import { updateNextSession } from 'database/shabadavalidb';
import { bugsnagErrorHandler } from 'utils';

export const fetchNextSessionData = async (usr: User, dispatch: any, setWebWorker: any) => {
  try {
    const nextSession = usr?.nextSession ?? [];
    if (nextSession.length > 0) {
      dispatch(setWebWorker(false));
      return;
    }
    const { gameArray } = await gameAlgo(usr);
    await updateNextSession(usr.uid, gameArray);
    dispatch(setWebWorker(false));
  } catch (error) {
    dispatch(setWebWorker(false));
    bugsnagErrorHandler(usr.uid, error, 'web worker', {}, usr);
  }
};
