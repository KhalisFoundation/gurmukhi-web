import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CONSTANTS from 'constants/constant';

const currentLevelSlice = createSlice({
  name: 'currentLevel',
  initialState: 0,
  reducers: {
    setCurrentLevel: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
    increment: (state) => {
      return state + CONSTANTS.DEFAULT_ONE;
    },
    resetLevel: () => {
      return 0;
    },
  },
});
export const { setCurrentLevel, increment, resetLevel } = currentLevelSlice.actions;
export default currentLevelSlice.reducer;
