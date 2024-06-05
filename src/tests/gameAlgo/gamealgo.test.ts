/* eslint-disable no-magic-numbers */
import { gameAlgo } from 'pages/dashboard/utils';
import { User } from 'types';
import seed0 from 'data/seed0.json';
import { currentTimestamp } from 'tests/mockData/userData';

describe('getNewQuestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Game Algorithm - New User', () => {
    it('should return seed data', async () => {
      const user: User = {
        displayName: 'Amitoj Singh',
        role: 'student',
        photoURL: 'some url',
        uid: 'lakhdsfaoidjfakldnnmadflkjj',
        coins: 0,
        email: 'amitojsingh@shabadavali.ca',
        emailVerified: true,
        progress: {
          gameSession: [],
          currentLevel: 0,
          currentProgress: 0,
        },
        nextSession: [],
        wordIds: [],
        learntWordIds: [],
        user: null,
        created_at: currentTimestamp,
        updated_at: currentTimestamp,
        lastLogInAt: currentTimestamp,
      };
      const { gameArray } = await gameAlgo(user);
      const questionObjects = gameArray.filter(
        (obj) => obj.key && obj.key.startsWith('questions-') && obj.key.split('-').length === 3,
      );
      // Check if there are exactly 13 objects that match the pattern
      expect(questionObjects).toHaveLength(13);

      expect(gameArray).toEqual(seed0);
      //check if learning words are unique.
    });
  });
});
