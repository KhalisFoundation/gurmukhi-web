import { Timestamp } from 'firebase/firestore';
import { DefineWord, QuestionData, SentenceWord, WordType } from 'types';
import { User as FirebaseUser } from 'firebase/auth';

export interface GameScreen {
  key: string;
  data: DefineWord | SentenceWord | QuestionData | WordType;
}
export interface User {
  user: FirebaseUser | null;
  username?: string;
  displayName: string;
  role: string;
  photoURL: string;
  uid: string;
  coins: number;
  email: string;
  emailVerified: boolean;
  progress: {
    gameSession: GameScreen[];
    currentLevel: number;
    currentProgress: number;
  };
  nextSession?: GameScreen[];
  wordIds: string[];
  created_at: Timestamp | string;
  updated_at: Timestamp;
  lastLogInAt: Timestamp | string;
}

export interface WordShabadavaliDB {
  isLearnt: boolean;
  progress: number;
  isWordRead: boolean;
  word_id: string;
  word: string;
  image?: string;
  id?: string;
  lastReviewed?: Timestamp;
  questionIds: string[];
}

export interface ProgressData {
  wordIds?: string[],
  coins: number,
  progress: {
    currentLevel: number,
    currentProgress: number,
    gameSession: GameScreen[],
  },
  nextSession: GameScreen[],
}
