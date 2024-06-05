import { analytics } from '../firebase';
import { setUserId, setUserProperties, logEvent } from 'firebase/analytics';
import CONSTANTS from 'constants/constant';

export const updateUser = (uid: string) => {
  setUserId(analytics, uid);
};

export const updateUserProperties = (properties: { [key: string]: any }) => {
  setUserProperties(analytics, properties);
};

export const logUserEvent = (title: string, properties: { [key: string]: any }) => {
  logEvent(analytics, title, properties);
};

export const logSessionTime = (duration: number) => {
  const durationInMinutes = Math.floor(duration / CONSTANTS.SESSION_DIVIDEND);
  console.log('Duration is ', durationInMinutes);
  logEvent(analytics, 'session_duration', {
    duration: durationInMinutes,
  });
};
