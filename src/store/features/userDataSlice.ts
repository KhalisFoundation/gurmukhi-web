import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types';

const userDataSlice = createSlice({
  name: 'userData',
  initialState: null as User | null,
  reducers: {
    setUserData: (state, action: PayloadAction<User | null>) => {
      return action.payload;
    },
    resetUserData: () => {
      return null;
    },
  },
});
export const { setUserData, resetUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
