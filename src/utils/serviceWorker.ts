import { gameAlgo } from 'pages/dashboard/utils';
import { User } from 'types/shabadavalidb';
import { getUserData, updateNextSession } from 'database/shabadavalidb';

export const fetchNextSessionData = async (usr: User) => {
  try {
    const data = await getUserData(usr.uid);
    const nextSession = data?.nextSession ?? [];
    if (nextSession.length > 0) {
      return;
    }
    const { gameArray } = await gameAlgo(usr);
    await updateNextSession(usr.uid, gameArray);
  } catch (error) {
    console.error('Error fetching next session data:', error);
  }
};
