import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Semantic } from 'types';

const semanticsArraySlice = createSlice({
  name: 'semanticsArray',
  initialState: [] as Semantic[],
  reducers: {
    addScreens: (state, action: PayloadAction<Semantic[]>) => {
      if (Array.isArray(action.payload)) {
        return [...action.payload];
      } else {
        return [...state, action.payload];
      }
    },
    resetSemanticsArray: () => {
      return [];
    },
  },
});

export const { addScreens, resetSemanticsArray } = semanticsArraySlice.actions;
export default semanticsArraySlice.reducer;
