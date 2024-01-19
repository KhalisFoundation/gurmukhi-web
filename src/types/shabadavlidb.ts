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
  wordID: string;
  word: string;
  id: string;
}
export interface QuestionType {
  wordID: string;
  word: string;
  questionID: string;
  id: string;
  isLearnt: boolean;
  lastReviewed: string;
  question: string;
  answer: string;
  options: string;
}
