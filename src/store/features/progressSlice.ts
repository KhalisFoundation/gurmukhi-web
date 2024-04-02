import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserData, updateCurrentLevel, updateCurrentProgress, updateProgress, updateUserDocument } from 'database/shabadavalidb';
import { GameScreen, User } from 'types/shabadavalidb';

export const fetchProgress = createAsyncThunk(
  'progress/fetchProgress',
  async (uid: string) => {
    const user = await getUserData(uid);
    if (user && user.progress) {
      return user.progress;
    } else {
      return {
        currentLevel: 0,
        currentProgress: 0,
        gameSession: [],
      };
    }
  },
);

export const setProgress = createAsyncThunk(
  'progress/setProgress',
  async (user: User) => {
    if (user && user.progress) {
      return {
        currentLevel: user.progress.currentLevel || 0,
        currentProgress: user.progress.currentProgress || 0,
        gameSession: user.progress.gameSession || null,
      };
    } else {
      return {
        currentLevel: 0,
        currentProgress: 0,
        gameSession: [],
      };
    }
  },
);

export const updateUserProgress = createAsyncThunk(
  'progress/updateProgress',
  async (data: { uid: string; currentProgress: number; gameArray: GameScreen[]; currentLevel: number }) => {
    const { uid, currentProgress, gameArray, currentLevel } = data;
    await updateProgress(uid, currentProgress, gameArray, currentLevel);
    return {
      currentProgress,
      gameArray,
      currentLevel,
    };
  },
);

export const incrementLevel = createAsyncThunk(
  // also post that change to firestore
  'progress/incrementLevel',
  async (data: { uid: string, currentLevel: number }) => {
    const { uid, currentLevel } = data;
    const newLevel = currentLevel + 1;
    await updateCurrentLevel(uid, newLevel);
    return newLevel;
  },
);

export const incrementProgress = createAsyncThunk(
  'progress/incrementProgress',
  async (data: { uid: string; currentProgress: number }) => {
    const { uid, currentProgress } = data;
    await updateCurrentProgress(uid, currentProgress );
    return currentProgress;
  },
);

export const setCurrentGamePosition = createAsyncThunk(
  'progress/setCurrentGamePosition',
  async (data: { uid: string, currentGamePosition: number }) => {
    const { uid, currentGamePosition } = data;
    await updateCurrentProgress(uid, currentGamePosition);
    return currentGamePosition;
  },
);

export const addScreens = createAsyncThunk(
  'progress/addScreens',
  async (data: { uid: string, gameArray: GameScreen | GameScreen[] }, { getState }) => {
    const { uid, gameArray } = data;
    const state = getState() as User;
    const { currentLevel, currentProgress } = state.progress;
    const gameSession = Array.isArray(gameArray) ? gameArray : [gameArray];
    await updateProgress(uid, currentProgress, gameSession, currentLevel);
    return gameSession;
  },
);

export const resetScreens = createAsyncThunk(
  'progress/resetScreens',
  async (uid: string) => {
    await updateUserDocument(uid, { gameSession: [] });
    return [];
  },
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    currentLevel: 0,
    currentProgress: 0,
    gameSession: [] as GameScreen | GameScreen[],
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProgress.fulfilled, (state, action) => {
      const { currentLevel, currentProgress, gameSession } = action.payload;
      state.currentLevel = currentLevel;
      state.currentProgress = currentProgress;
      state.gameSession = gameSession;
    });
    builder.addCase(updateUserProgress.fulfilled, (state, action) => {
      const { currentProgress, gameArray, currentLevel } = action.payload;
      state.currentProgress = currentProgress;
      state.gameSession = gameArray;
      state.currentLevel = currentLevel;
    });
    builder.addCase(addScreens.fulfilled, (state, action) => {
      state.gameSession = action.payload;
    });
    builder.addCase(incrementLevel.fulfilled, (state, action) => {
      state.currentLevel = action.payload;
    });
    builder.addCase(incrementProgress.fulfilled, (state, action) => {
      state.currentProgress = action.payload;
    });
    builder.addCase(setCurrentGamePosition.fulfilled, (state, action) => {
      state.currentProgress = action.payload;
    });
  },
});


export default progressSlice.reducer;
