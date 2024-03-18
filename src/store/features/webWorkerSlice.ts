import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const webWorkerSlice = createSlice({
  name: 'serviceWorker',
  initialState: false,
  reducers: {
    setWebWorker: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});
export const { setWebWorker } = webWorkerSlice.actions;
export default webWorkerSlice.reducer;
