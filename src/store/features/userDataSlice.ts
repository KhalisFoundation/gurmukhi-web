import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProgressData, User } from 'types';

const userDataSlice = createSlice({
  name: 'userData',
  initialState: null as User | null,
  reducers: {
    setUserData: (state, action: PayloadAction<User | null>) => {
      return action.payload;
    },
    setUserProgress: (state, action: PayloadAction<ProgressData | null>) => {
      return {
        ...state,
        ...action.payload,
      } as User;
    },
    resetUserData: () => {
      return null;
    },
  },
});
export const { setUserData, setUserProgress, resetUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
