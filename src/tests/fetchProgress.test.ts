import mockUserData from './mockData/userData';
import { fetchProgress } from '../pages/dashboard/utils/helpers';

describe('fetchProgress', () => {
  it('should return gameSession', () => {
    const result = fetchProgress(mockUserData[0]);
    expect(result).toEqual(mockUserData[0].progress.gameSession);
  });

  it('returns null if the gameSession does not exist', () => {
    const user = undefined;
    const result = fetchProgress(user);
    expect(result).toBeNull();
  });
});
