import { QuestionData, WordType } from 'types';
import { GameScreen, User } from 'types/shabadavalidb';

export const checkIsFirstTime = (user: User) => {
  return (
    user?.progress.currentLevel === 0 &&
    user?.progress.currentProgress === 0 &&
    user?.progress.gameSession.length === 0
  );
};

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const createGameScreen = (key: string, data: QuestionData | WordType): GameScreen => {
  return { key, data };
};

export const fetchProgress = (user: any) => {
  const gameSession = user?.progress.gameSession;
  return gameSession && gameSession.length > 0 ? gameSession : null;
};
