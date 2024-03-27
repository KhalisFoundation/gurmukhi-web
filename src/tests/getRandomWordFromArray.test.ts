import { getRandomWordFromArray } from '../../src/pages/dashboard/utils/helpers'; // Adjust the import path as needed
import mockWords from './mockData/wordShabadavliDB';
import { WordShabadavaliDB } from 'types/shabadavalidb';

describe('getRandomWordFromArray', () => {
  it('should return a word object from the array', () => {
    const word = getRandomWordFromArray(mockWords);
    expect(mockWords).toContainEqual(word);
  });

  it('should return an object with expected properties', () => {
    const word = getRandomWordFromArray(mockWords);
    expect(word).toHaveProperty('isLearnt');
    expect(word).toHaveProperty('word');
    expect(word).toHaveProperty('word_id');
    expect(word).toHaveProperty('questionIds');
    expect(word).toHaveProperty('isWordRead');
    expect(word).toHaveProperty('progress');
  });

  it('should not modify the original array', () => {
    const originalArray = [...mockWords];
    getRandomWordFromArray(mockWords);
    expect(mockWords).toEqual(originalArray);
  });

  it('returns undefined for an empty array', () => {
    const emptyArray: WordShabadavaliDB[] = [];
    const result = getRandomWordFromArray(emptyArray);
    expect(result).toBeUndefined();
  });
});
