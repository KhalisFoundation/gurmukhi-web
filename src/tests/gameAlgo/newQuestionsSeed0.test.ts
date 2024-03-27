import getNewQuestions from 'pages/dashboard/hooks/useNew';
// import { QuestionData, WordType } from 'types';
// import { GameScreen } from 'types/shabadavalidb';
// import seed0 from 'data/seed0.json';
// import mockLearningWords from 'tests/mockData/learningWordsSeed0';

// jest.mock('pages/dashboard/utils', () => ({
//   createGameScreen: jest.fn(
//     (key: string, data: QuestionData | WordType): GameScreen => ({
//       key,
//       data,
//     }),
//   ),
// }));
// jest.mock('pages/dashboard/hooks/useNew', () => ({
//   __esModule: true,
//   default: jest.fn().mockImplementation(async (count: number, isLocal: boolean) => {
//     const game = isLocal ? seed0 : [];
//     const learningWords = mockLearningWords;
//     return { game, learningWords };
//   }),
// }));

describe('getNewQuestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNewQuestions - Local Scenario', () => {
    it('should correctly process local seed data', async () => {
      const { game, learningWords } = await getNewQuestions(13, true);
      const questionObjects = game.filter(
        (obj) => obj.key && obj.key.startsWith('questions-') && obj.key.split('-').length === 3,
      );
      // Check if there are exactly 13 objects that match the pattern
      expect(questionObjects).toHaveLength(13);

      //check if learning words are unique.
      const uniqueLearningWords = new Set(learningWords.map((word) => word.word_id));
      expect(uniqueLearningWords.size).toBe(learningWords.length);
    });
  });
});
