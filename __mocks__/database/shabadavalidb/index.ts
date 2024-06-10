import { jest } from '@jest/globals';
import { shabadavaliDB } from 'firebase';
import { writeBatch } from 'firebase/firestore';

export const getWords = jest.fn(() => {
  return [{ words: 'words' }];
});

export const getBatch = jest.fn(() => {
  return writeBatch(shabadavaliDB);
});
export const addWordsBatch = jest.fn();
