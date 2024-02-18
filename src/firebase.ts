import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  NextOrObserver,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const userStateListener = (
  callback:NextOrObserver<User>,
) => onAuthStateChanged(auth, callback);

export const logOut = async () => signOut(auth);

export const passwordReset = async (email: string) => sendPasswordResetEmail(auth, email);

export const wordsdb = getFirestore(app);
export const shabadavaliDB = getFirestore(
  app,
  firebaseConfig.projectId === 'gurmukhi-dev'
    ? 'shabadavali-dev'
    : 'shabadavali',
);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

export default app;
