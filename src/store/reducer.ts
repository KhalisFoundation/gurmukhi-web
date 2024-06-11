import { combineReducers } from '@reduxjs/toolkit';
import currentGamePositionReducer from './features/currentGamePositionSlice';
import currentLevelReducer from './features/currentLevelSlice';
import gameArrayReducer from './features/gameArraySlice';
import learningWordReducer from './features/learningWordSlice';
import nanakCoin from './features/nanakCoin';
import webWorkerReducer from './features/webWorkerSlice';
import learntWordIdsReducer from './features/learntWordIdsSlice';
import nextSessionReducer from './features/nextSessionSlice';

export const rootReducer = combineReducers({
  currentGamePosition: currentGamePositionReducer,
  currentLevel: currentLevelReducer,
  learningWords: learningWordReducer,
  learntWordIds: learntWordIdsReducer,
  gameArray: gameArrayReducer,
  nextSession: nextSessionReducer,
  nanakCoin: nanakCoin,
  webWorker: webWorkerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
