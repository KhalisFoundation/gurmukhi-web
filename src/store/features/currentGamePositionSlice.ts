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
  },
});

export const { setCurrentGamePosition, increment } = currentGamePositionSlice.actions;
export default currentGamePositionSlice.reducer;
