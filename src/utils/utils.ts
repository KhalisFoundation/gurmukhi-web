import moment from 'moment';

const convertNumber = (num: number) => {
  return `You got your ${moment.localeData().ordinal(num)} Nanak Coin!`;
};

export default convertNumber;
