import { DocumentReference } from 'firebase/firestore';
import { User } from './shabadavalidb';
import { UserCredential } from 'firebase/auth';

export interface AuthContextValue {
  user: User | null | object;
  logIn: (
    email: string,
    password: string,
    showToastMessage: (text: string, error?: boolean) => void
  ) => Promise<UserCredential | null>;
  signUp: (
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    showToastMessage: (text: string, error?: boolean) => void
  ) => Promise<boolean>;
  logOut: () => Promise<void>;
  signInWithGoogle: (
    showToastMessage: (text: string, error?: boolean) => void
  ) => Promise<boolean | undefined>;
  resetPassword: (email: string) => Promise<void>;
}

export interface Option {
  id?: string;
  value?: string;
  option?: string;
  label?: string;
  translation?: string;
  word: string;
}

export interface QuestionData {
  id?: string;
  question: string;
  translation?: string;
  image?: string;
  type?: string;
  options: Option[] | string[];
  answer: number;
  word_id: string;
  word: string;
}

export interface Translation {
  en?: string;
  hi?: string;
}

export interface WordType {
  id: string;
  word_id?: string;
  word?: string;
  translation?: string;
  meaning_english?: string;
  meaning_punjabi?: string;
  part_of_speech?: string;
  images?: string[];
  antonyms?: MiniWord[];
  synonyms?: MiniWord[];
  sentences?: {
    sentence: string;
    translation: string;
    audioURL?: string;
  }[];
  questions?: QuestionData[];
  status?: string;
  created_at?: TimestampType;
  created_by?: string;
  updated_at?: TimestampType;
  updated_by?: string;
  notes?: string;
  wordlists?: DocumentReference[];
  is_for_support?: boolean;
  audioURL?: string;
}

export interface MiniWord {
  id?: string;
  word?: string;
  translation?: string;
  is_for_support?: boolean;
}

export interface Status {
  [key: string]: string;
}

export interface TimestampType {
  seconds: number;
  nanoseconds: number;
}

export interface SignError {
  code: string,
  message: string
}

export interface SentenceType {
  sentence: string;
  translation: string;
  audioURL?: string;
}

export interface DefineWord {
  word: string;
  translation: string;
  meaning_english: string;
  meaning_punjabi: string;
  images: string[];
}

export interface Sentences {
  id?: string;
  word_id?: string;
  translation?: string;
  sentence: string;
}
export interface SentenceWord {
  word: string;
  translation: string;
  sentences: Sentences[];
}

export * from './shabadavalidb';
