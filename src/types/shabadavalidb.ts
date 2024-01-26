import { Timestamp } from 'firebase/firestore';
import { Option } from 'types';

export interface GameScreen {
  key: string;
  data: any;
}
export interface User {
  displaName: string;
  role: string;
  photoURL: string;
  uid: string;
  coins: number;
  wordsLearnt: number;
  email: string;
  progress: {
    gameSession: GameScreen[];
    currentLevel: number;
    currentProgress: number;
  };
}
export interface WordShabadavaliDB {
  isLearnt: boolean;
  progress: number;
  isWordRead: boolean;
  word_id: string;
  word: string;
  id?: string;
}
export interface QuestionType {
  word_id: string;
  word: string;
  question_id: string;
  id?: string;
  isLearnt: boolean;
  lastReviewed?: Timestamp;
  question: string;
  answer: number;
  options: Option[] | string[];
  type?: string;
  image?: string;
}
