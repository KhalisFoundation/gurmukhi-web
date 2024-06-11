import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const learntWordIdsSlice = createSlice({
  name: 'learntWordIds',
  initialState: [] as string[],
  reducers: {
    addLearntWordIds: (state, action: PayloadAction<string | string[]>) => {
      let uniqueIds;
      if (Array.isArray(action.payload)) {
        uniqueIds = new Set([...state, ...action.payload]);
      } else {
        uniqueIds = new Set([...state, action.payload]);
      }
      return Array.from(uniqueIds);
    },
    resetLearntWordIds: () => {
      return [];
    },
  },
});
export const { addLearntWordIds, resetLearntWordIds } = learntWordIdsSlice.actions;
export default learntWordIdsSlice.reducer;
