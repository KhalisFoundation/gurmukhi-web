import { localeData } from 'moment';
import { checkIfUsernameUnique } from 'database/shabadavalidb';
import CONSTANTS from 'constants/constant';

export const convertNumber = (num: number) => {
  return `You got your ${localeData().ordinal(num)} Nanak Coin!`;
};
const getRandomInt = (min: number, max: number) =>
  ((Math.random() * ((max | 0) - (min | 0) + CONSTANTS.DEFAULT_ONE)) + (min | 0)) | 0;

function generateFromEmail(email: string) {
  const nameParts = email.replace(/@.+/, '');
  const name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, '');
  const randomNum = getRandomInt(CONSTANTS.DEFAULT_THOUSAND, CONSTANTS.DEFAULT_FOUR_NINES);
  const randomNumber = Math.floor(randomNum).toString();
  return name + randomNumber;
}

export async function generateRandomUsername(email: string) {
  let username = generateFromEmail(email);
  let unique = false;

  while (!unique) {
    username = generateFromEmail(email);
    unique = await checkIfUsernameUnique(username);
  }

  return username;
}
