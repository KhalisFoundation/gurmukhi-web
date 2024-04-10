import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const lastDocumentIDSlice = createSlice({
  name: 'lastDocumentID',
  initialState: '',

  reducers: {
    setLastDocumentID: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
    resetLastDocumentID: () => {
      return '';
    },
  },
});

export const { setLastDocumentID } = lastDocumentIDSlice.actions;
export default lastDocumentIDSlice.reducer;
