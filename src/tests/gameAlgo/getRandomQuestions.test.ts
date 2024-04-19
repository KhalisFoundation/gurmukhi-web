import { User } from 'types/shabadavalidb';
import getRandomQuestions from 'pages/dashboard/hooks/useQuestions';

describe('Reset all mocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Random Questions', () => {
    it('should return random questions', async () => {
      const user: User = {
        displayName: 'Amitoj Singh',
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
      const gameArray = await getRandomQuestions(user, 11, false);
      const questionObjects = gameArray.filter(
        (obj) => obj.key && obj.key.startsWith('questions-') && obj.key.split('-').length === 3,
      );
      // Check if there are exactly 13 objects that match the pattern
      expect(questionObjects).toHaveLength(13);
    });
  });
});
