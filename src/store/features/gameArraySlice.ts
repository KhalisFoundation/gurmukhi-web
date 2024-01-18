import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameScreen } from 'types';

const gameArraySlice = createSlice({
  name: 'gameArray',
  initialState: [] as GameScreen[],
  reducers: {
    addScreens: (state, action: PayloadAction<GameScreen | GameScreen[]>) => {
      if (Array.isArray(action.payload)) {
        return [...action.payload];
      } else {
        return [...state, action.payload];
      }
    },
    // removeScreen: (state, action: PayloadAction<string>) => {
    //   const index = state.findIndex((item) => item === action.payload);
    //   if (index !== -1) {
    //     state.splice(index, 1);
    //   }
    // },
    // updateScreen: (state, action: PayloadAction<string>) => {
    //   const index = state.findIndex((item) => item === action.payload);
    //   if (index !== -1) {
    //     state[index] = action.payload;
    //   }
    // },
    reset: () => {
      return [];
    },
  },
});
export const { addScreens, reset } = gameArraySlice.actions;
export default gameArraySlice.reducer;
