import { combineReducers } from '@reduxjs/toolkit';
// import currentGamePositionReducer from './features/currentGamePositionSlice';
// import currentLevelReducer from './features/currentLevelSlice';
// import gameArrayReducer from './features/gameArraySlice';
import learningWordReducer from './features/learningWordSlice';
import nanakCoin from './features/nanakCoin';
import progressSlice from './features/progressSlice';
import webWorkerReducer from './features/webWorkerSlice';

export const rootReducer = combineReducers({
  progress: progressSlice,
  learningWords: learningWordReducer,
  nanakCoin: nanakCoin,
  webWorker: webWorkerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
