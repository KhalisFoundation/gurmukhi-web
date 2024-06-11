import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameScreen } from 'types';

const nextSessionSlice = createSlice({
  name: 'nextSession',
  initialState: [] as GameScreen[],
  reducers: {
    addNextScreens: (state, action: PayloadAction<GameScreen | GameScreen[]>) => {
      if (Array.isArray(action.payload)) {
        return [...action.payload];
      } else {
        return [...state, action.payload];
      }
    },
    resetNextSession: () => {
      return [];
    },
  },
});

export const { addNextScreens, resetNextSession } = nextSessionSlice.actions;
export default nextSessionSlice.reducer;
