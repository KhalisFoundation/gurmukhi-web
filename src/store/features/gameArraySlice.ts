import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const gameArraySlice = createSlice({
  name: 'gameArray',
  initialState: [] as string[],
  reducers: {
    addScreens: (state, action: PayloadAction<string | string[]>) => {
      if (Array.isArray(action.payload)) {
        state.push(...action.payload);
      } else {
        state.push(action.payload);
      }
    },
    removeScreen: (state, action: PayloadAction<string>) => {
      state = state.filter((item) => item !== action.payload);
    },
    updateScreen: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((item) => item === action.payload);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});
export const { addScreens, removeScreen, updateScreen } = gameArraySlice.actions;
export default gameArraySlice.reducer;
