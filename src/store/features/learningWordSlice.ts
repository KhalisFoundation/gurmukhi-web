import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const learningWordSlice = createSlice({
  name: 'learningWords',
  initialState: [] as string[],
  reducers: {
    addWordIDs: (state, action: PayloadAction<string | string[]>) => {
      if (Array.isArray(action.payload)) {
        return [...action.payload];
      } else {
        return [...state, action.payload];
      }
    },
    removeWordID: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((item) => item === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    updateWordID: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((item) => item === action.payload);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    reset: () => {
      return [];
    },
  },
});
export const { addWordIDs, removeWordID, updateWordID, reset } = learningWordSlice.actions;
export default learningWordSlice.reducer;
