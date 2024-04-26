import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CONSTANTS from 'constants/constant';

const nanakCoinSlice = createSlice({
  name: 'nanakCoin',
  initialState: 0,
  reducers: {
    setNanakCoin: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
    increment: (state) => {
      return state + CONSTANTS.DEFAULT_ONE;
    },
    resetCoins: () => {
      return 0;
    },
  },
});
export const { setNanakCoin, increment, resetCoins } = nanakCoinSlice.actions;
export default nanakCoinSlice.reducer;
