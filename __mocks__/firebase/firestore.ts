import { jest } from '@jest/globals';

export const getFirestore = jest.fn();
export const collection = jest.fn();
export const writeBatch = jest.fn(() => {
  return {
    update: jest.fn(),
    commit: jest.fn(),
  };
});
export const where = jest.fn();
export const query = jest.fn();
export const getDocs = jest.fn(() => {
  return Promise.resolve({
    empty: false,
    docs: [
      {
        data: () => ({
          /* Mocked document data */
        }),
        id: 'mockDocId1',
      },
      // Add more mocked documents if needed
    ],
  });
});

export const doc = jest.fn();
export const arrayUnion = jest.fn();
