// __mocks__/firebase/app.ts
import { jest } from '@jest/globals';

const firestore = jest.fn(() => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(async () => ({
        exists: true,
        data: () => ({ foo: 'bar' }),
      })),
      set: jest.fn(async () => ({})),
      update: jest.fn(async () => ({})),
    })),
  })),
}));

// Mock any other Firebase services here

// Default export mimics the Firebase namespace structure
export const firebase = {
  firestore,
  // Mock other Firebase services as needed
};

// Mimic the initializeApp function
export const initializeApp = jest.fn(() => firebase);
