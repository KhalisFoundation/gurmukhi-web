import { gameAlgo } from 'pages/dashboard/utils';
import { User } from 'types/shabadavalidb';
import seed0 from 'data/seed0.json';

describe('getNewQuestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Game Algorithm - New User', () => {
    it('should return seed data', async () => {
      const user: User = {
        displaName: 'Amitoj Singh',
        role: 'student',
        photoURL: 'some url',
        uid: 'lakhdsfaoidjfakldnnmadflkjj',
        coins: 0,
        email: 'amitojsingh@shabadavali.ca',
        progress: {
          gameSession: [],
          currentLevel: 0,
          currentProgress: 0,
        },
        nextSession: [],
        wordIds: [],
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
