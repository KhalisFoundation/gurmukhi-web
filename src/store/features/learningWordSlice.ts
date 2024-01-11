import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const learningWordSlice = createSlice({
  name: 'learningWords',
  initialState: [] as string[],
  reducers: {
    addWordIDs: (state, action: PayloadAction<string | string[]>) => {
      if (Array.isArray(action.payload)) {
        state.push(...action.payload);
      } else {
        state.push(action.payload);
      }
    },
    removeWordID: (state, action: PayloadAction<string>) => {
      state = state.filter((item) => item !== action.payload);
    },
    updateWordID: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((item) => item === action.payload);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});
export const { addWordIDs, removeWordID, updateWordID } = learningWordSlice.actions;
export default learningWordSlice.reducer;
