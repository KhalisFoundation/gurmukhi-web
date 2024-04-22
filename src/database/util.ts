import CONSTANTS from 'constants/constant';
export const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < CONSTANTS.RANDOM_LIIMIT; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomId;
};
