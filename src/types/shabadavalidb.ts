import { Timestamp } from 'firebase/firestore';

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
  email: string;
  progress: {
    gameSession: GameScreen[];
    currentLevel: number;
    currentProgress: number;
  };
  nextSession?: GameScreen[];
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
