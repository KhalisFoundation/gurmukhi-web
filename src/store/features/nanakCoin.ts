import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const nanakCoinSlice = createSlice({
  name: 'nanakCoin',
  initialState: 0,
  reducers: {
    setNanakCoin: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
    increment: (state) => {
      return state + 1;
    },
    resetCoins: () => {
      return 0;
    },
  },
});
export const { setNanakCoin, increment, resetCoins } = nanakCoinSlice.actions;
export default nanakCoinSlice.reducer;
