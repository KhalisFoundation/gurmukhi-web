import { checkIsFirstTime } from '../../pages/dashboard/utils/helpers';
describe('checkIsFirstTime', () => {
  it('should return true for first-time users', () => {
    const user = {
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
    expect(checkIsFirstTime(user)).toBeTruthy();
  });

  it('should return true for users with nanak coins but no progress', () => {
    const user = {
      displayName: 'Amitoj Singh',
      role: 'student',
      photoURL: 'some url',
      uid: 'lakhdsfaoidjfakldnnmadflkjj',
      coins: 13,
      email: 'amitojsingh@shabadavali.ca',
      progress: {
        gameSession: [],
        currentLevel: 0,
        currentProgress: 0,
      },
      nextSession: [],
      wordIds: [],
    };
    expect(checkIsFirstTime(user)).toBeTruthy();
  });

  it('should return false for returning users', () => {
    const user = {
      displayName: 'Amitoj Singh',
      role: 'student',
      photoURL: 'some url',
      uid: 'lakhdsfaoidjfakldnnmadflkjj',
      coins: 1,
      email: 'amitojsingh@shabadavali.ca',
      progress: {
        gameSession: [],
        currentLevel: 1,
        currentProgress: 2,
      },
      nextSession: [],
      wordIds: [],
    };
    expect(checkIsFirstTime(user)).toBeFalsy();
  });
});
