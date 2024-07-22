import { localeData } from 'moment';

export const convertNumber = (num: number) => {
  return `You got your ${localeData().ordinal(num)} Nanak Coin!`;
};
