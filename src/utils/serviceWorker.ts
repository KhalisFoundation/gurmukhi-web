import { gameAlgo } from 'pages/dashboard/utils';
import { User } from 'types/shabadavalidb';
import { updateNextSession } from 'database/shabadavalidb';

export const fetchNextSessionData = async (usr: User) => {
  try {
    const nextSession = usr?.nextSession ?? [];
    if (nextSession.length > 0) {
      return;
    }
    const { gameArray } = await gameAlgo(usr);
    console.log('------', gameArray);
    await updateNextSession(usr.uid, gameArray);
  } catch (error) {
    console.error('Error fetching next session data:', error);
  }
};
