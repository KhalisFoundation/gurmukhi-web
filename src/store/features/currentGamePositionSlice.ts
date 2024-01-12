import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const currentGamePositionSlice = createSlice({
  name: 'currentGamePosition',
  initialState: 0,
  reducers: {
    setCurrentGamePosition: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
    increment: (state) => {
      return state + 1;
    },
    resetGamePosition: () => {
      return 0;
    },
  },
});

export const { setCurrentGamePosition, increment, resetGamePosition } =
  currentGamePositionSlice.actions;
export default currentGamePositionSlice.reducer;
