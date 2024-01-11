import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const currentLevelSlice = createSlice({
  name: 'currentLevel',
  initialState: 0,
  reducers: {
    setCurrentLevel: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
    increment: (state) => {
      return state + 1;
    },
  },
});
export const { setCurrentLevel, increment } = currentLevelSlice.actions;
export default currentLevelSlice.reducer;
