import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartialUser, User } from 'types';

const userDataSlice = createSlice({
  name: 'userData',
  initialState: null as User | null,
  reducers: {
    setUserData: (state, action: PayloadAction<User | null>) => {
      return action.payload;
    },
    updateUserData: (state, action: PayloadAction<PartialUser | null>) => {
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
export const { setUserData, updateUserData, resetUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
