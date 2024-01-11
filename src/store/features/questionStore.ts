import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuestionData } from 'types';
import { getQuestionsByWordID } from 'database/question';

interface QuestionState {
  questions: QuestionData[];
  currentQuestionIndex: number;
}

interface QuestionsByWordID {
  [wordID: string]: QuestionState;
}

interface FetchQuestionsPayload {
  wordID: string;
  questions: QuestionData[];
}

interface QuestionsSliceState {
  byWordID: QuestionsByWordID;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

// Async thunk for fetching questions
export const fetchQuestions = createAsyncThunk<
  FetchQuestionsPayload,
  string,
  { state: QuestionsSliceState }
>('questions/fetchQuestions', async (wordID, { getState }) => {
  const response = await getQuestionsByWordID(wordID); // Replace with your fetch function
  return { wordID, questions: response, count: response.length };
});

const initialState: QuestionsSliceState = {
  byWordID: {},
  status: 'idle',
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    getNextQuestion: (state, action: PayloadAction<{ wordID: string }>) => {
      const { wordID } = action.payload;
      const wordData = state.byWordID[wordID];

      if (wordData && wordData.currentQuestionIndex < wordData.questions.length - 1) {
        wordData.currentQuestionIndex += 1;
      } else {
        // Handle end of questions or reset
      }
    },
    resetQuestions: (state, action: PayloadAction<{ wordID: string }>) => {
      const { wordID } = action.payload;
      state.byWordID[wordID] = {
        questions: [],
        currentQuestionIndex: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        const { wordID, questions } = action.payload;
        state.status = 'succeeded';
        state.byWordID[wordID] = {
          questions,
          currentQuestionIndex: 0,
        };
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { getNextQuestion, resetQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
