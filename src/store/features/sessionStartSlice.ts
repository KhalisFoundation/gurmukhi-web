import { createSlice } from '@reduxjs/toolkit';

const sessionStartSlice = createSlice({
  name: 'sessionStart',
  initialState: Date.now(),
  reducers: {
    resetSessionStart: () => {
      const sessionStart = Date.now();
      return sessionStart;
    },
  },
});
export const { resetSessionStart } = sessionStartSlice.actions;
export default sessionStartSlice.reducer;
