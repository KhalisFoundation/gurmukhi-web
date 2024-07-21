import { localeData } from 'moment';
import crypto from 'crypto';
import CONSTANTS from '../constants/constant';
import { checkIfUsernameUnique } from 'database/shabadavalidb';

export const convertNumber = (num: number) => {
  return `You got your ${localeData().ordinal(num)} Nanak Coin!`;
};

export async function generateRandomUsername(email: string) {
  let username = email.split('@')[0];
  let unique = false;

  while (!unique) {
    const randomBytes = crypto.randomBytes(CONSTANTS.DEFAULT_FOUR);
    let randomNum = randomBytes.readUInt32BE(0);
    const max = CONSTANTS.DEFAULT_HUNDRED + CONSTANTS.DEFAULT_ONE;
    randomNum = randomNum % max; // Limit randomNum within [0, max)

    username = `${username}${randomNum}`;
    unique = await checkIfUsernameUnique(username);
  }

  return username;
}
