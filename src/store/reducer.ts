import { combineReducers } from '@reduxjs/toolkit';
import currentGamePositionReducer from './features/currentGamePositionSlice';
import currentLevelReducer from './features/currentLevelSlice';
import gameArrayReducer from './features/gameArraySlice';
import learningWordReducer from './features/learningWordSlice';
import nanakCoin from './features/nanakCoin';
import webWorkerReducer from './features/webWorkerSlice';
import lastDocumentIDReducer from './features/lastDocumentID';

export const rootReducer = combineReducers({
  currentGamePosition: currentGamePositionReducer,
  currentLevel: currentLevelReducer,
  learningWords: learningWordReducer,
  gameArray: gameArrayReducer,
  nanakCoin: nanakCoin,
  webWorker: webWorkerReducer,
  lastDocumentID:lastDocumentIDReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
