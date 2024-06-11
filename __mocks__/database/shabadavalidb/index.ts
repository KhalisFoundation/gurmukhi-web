import { jest } from '@jest/globals';
export const getWords = jest.fn(() => {
  return [{ words: 'words' }];
});

export const addWordsBatch = jest.fn();
