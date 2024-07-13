import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'types';

const userDataSlice = createSlice({
  name: 'userData',
  initialState: {} as object | User,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    resetUserData: () => {
      return {};
    },
  },
});
export const { setUserData, resetUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
