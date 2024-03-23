import { getRandomElement } from '../pages/dashboard/utils/helpers';

describe('getRandomElement', () => {
  it('should return a random element from the array', () => {
    const array = ['a', 'b', 'c', 'd'];
    const element = getRandomElement([...array]);
    expect(array).toContain(element);
  });

  it('should remove the selected element from the original array', () => {
    const array = ['a', 'b', 'c', 'd'];
    const originalLength = array.length;
    getRandomElement(array);
    expect(array.length).toBe(originalLength - 1);
  });

  it('returns undefined and does not modify the array if it is empty', () => {
    const array: string[] = [];
    const element = getRandomElement(array);
    expect(element).toBeUndefined();
    expect(array).toEqual([]);
  });

  it('correctly removes the element from the array, ensuring it cannot be selected again in subsequent calls', () => {
    const array = ['a', 'b', 'c', 'd'];
    const firstElement = getRandomElement(array);
    const secondElement = getRandomElement(array);
    expect(firstElement).not.toBe(secondElement);
    expect(array).not.toContain(firstElement);
    expect(array).not.toContain(secondElement);
  });
});
