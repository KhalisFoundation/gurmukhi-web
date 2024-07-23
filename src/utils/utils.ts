import { localeData } from 'moment';

const convertNumber = (num: number) => {
  return `You got your ${localeData().ordinal(num)} Nanak Coin!`;
};

export default convertNumber;
