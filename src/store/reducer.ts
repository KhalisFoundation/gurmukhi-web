import { combineReducers } from '@reduxjs/toolkit';
import currentGamePositionReducer from './features/currentGamePositionSlice';
import currentLevelReducer from './features/currentLevelSlice';
import gameArrayReducer from './features/gameArraySlice';
import nanakCoin from './features/nanakCoin';
import webWorkerReducer from './features/webWorkerSlice';
import nextSessionReducer from './features/nextSessionSlice';
import userDataSlice from './features/userDataSlice';

export const rootReducer = combineReducers({
  currentGamePosition: currentGamePositionReducer,
  currentLevel: currentLevelReducer,
  gameArray: gameArrayReducer,
  nextSession: nextSessionReducer,
  nanakCoin: nanakCoin,
  webWorker: webWorkerReducer,
  userData: userDataSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
