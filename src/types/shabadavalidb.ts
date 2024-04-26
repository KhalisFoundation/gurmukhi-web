import { Timestamp } from 'firebase/firestore';
import { DefineWord, QuestionData, SentenceWord, WordType } from 'types';

export interface GameScreen {
  key: string;
  data: DefineWord | SentenceWord | QuestionData | WordType;
}
export interface User {
  displayName: string;
  role: string;
  photoURL: string;
  uid: string;
  coins: number;
  email: string;
  progress: {
    gameSession: GameScreen[];
    currentLevel: number;
    currentProgress: number;
  };
  nextSession?: GameScreen[];
  wordIds: string[];
}
export interface WordShabadavaliDB {
  isLearnt: boolean;
  progress: number;
  isWordRead: boolean;
  word_id: string;
  word: string;
  image?:string;
  id?: string;
  lastReviewed?:Timestamp;
  questionIds: string[];
}
