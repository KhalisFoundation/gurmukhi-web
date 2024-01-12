import { combineReducers } from '@reduxjs/toolkit';
import currentGamePositionReducer from './features/currentGamePositionSlice';
import currentLevelReducer from './features/currentLevelSlice';
import gameArrayReducer from './features/gameArraySlice';
import learningWordReducer from './features/learningWordSlice';
import nanakCoin from './features/nanakCoin';

export const rootReducer = combineReducers({
  currentGamePosition: currentGamePositionReducer,
  currentLevel: currentLevelReducer,
  learningWords: learningWordReducer,
  gameArray: gameArrayReducer,
  nanakCoin: nanakCoin,
});

export type RootState = ReturnType<typeof rootReducer>;
