import { shuffleArray } from '../pages/dashboard/utils/helpers';
import CONSTANTS from 'constants/constant';

describe('shuffleArray', () => {
  it('keeps the array the same length after shuffling', () => {
    const array = [
      CONSTANTS.DEFAULT_ONE,
      CONSTANTS.DEFAULT_TWO,
      CONSTANTS.DEFAULT_THREE,
      CONSTANTS.DEFAULT_FOUR,
      CONSTANTS.DEFAULT_FIVE,
    ];
    const shuffledArray = shuffleArray([...array]);
    expect(shuffledArray.length).toBe(array.length);
  });

  it('contains the same elements before and after shuffling', () => {
    const array = [
      CONSTANTS.DEFAULT_ONE,
      CONSTANTS.DEFAULT_TWO,
      CONSTANTS.DEFAULT_THREE,
      CONSTANTS.DEFAULT_FOUR,
      CONSTANTS.DEFAULT_FIVE,
    ];
    const shuffledArray = shuffleArray([...array]);
    expect(shuffledArray.sort()).toEqual(array.sort());
  });

  it('changes the order of elements (run multiple times to check for randomness)', () => {
    const array = [
      CONSTANTS.DEFAULT_ONE,
      CONSTANTS.DEFAULT_TWO,
      CONSTANTS.DEFAULT_THREE,
      CONSTANTS.DEFAULT_FOUR,
      CONSTANTS.DEFAULT_FIVE,
    ];
    let differentOrderCount = 0;
    const iterations = 10; // Run shuffle multiple times

    for (let i = 0; i < iterations; i++) {
      const shuffledArray = shuffleArray([...array]);
      if (JSON.stringify(array) !== JSON.stringify(shuffledArray)) {
        differentOrderCount++;
      }
    }

    expect(differentOrderCount).toBeGreaterThan(0);
  });
});
