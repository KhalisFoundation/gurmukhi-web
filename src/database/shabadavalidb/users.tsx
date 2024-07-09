import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  WriteBatch,
} from 'firebase/firestore';
import { shabadavaliDB as db } from '../../firebase';
import { GameScreen, User } from 'types';
import { bugsnagErrorHandler } from 'utils';
import nanakCoin from 'store/features/nanakCoin';

export const usersCollection = collection(db, 'users');

export const getUser = async (email: string, uid: string) => {
  try {
    // uid is the document id of the user
    const userRef = doc(usersCollection, uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const user = userDoc.data();
      // check if the email matches
      if (user.email === email) {
        return user;
      }
    }
    return null;
  } catch (error) {
    bugsnagErrorHandler(error, 'getUser', { email, uid });
  }
};

export const checkUser = async (uid: string, email: string) => {
  try {
    const queryStatement = query(
      usersCollection,
      where(documentId(), '==', uid),
      where('email', '==', email),
    );
    const usersSnapshot = await getDocs(queryStatement);
    if (!usersSnapshot.empty) {
      return true;
    }
    return false;
  } catch (error) {
    bugsnagErrorHandler(error, 'checkUser', { uid, email });
  }
};

export const checkIfUsernameUnique = async (username: string) => {
  try {
    const queryStatement = query(usersCollection, where('username', '==', username));
    const usersSnapshot = await getDocs(queryStatement);
    return usersSnapshot.empty;
  } catch (error) {
    bugsnagErrorHandler(error, 'checkIfUserNameUnique', { username });
  }
};

export const checkIfEmailUnique = async (email: string) => {
  try {
    const queryStatement = query(usersCollection, where('email', '==', email));
    const usersSnapshot = await getDocs(queryStatement);
    return usersSnapshot.empty;
  } catch (error) {
    bugsnagErrorHandler(error, 'checkIfEmailUnique', { email });
  }
};

export const getEmailFromUsername = async (username: string) => {
  try {
    const queryStatement = query(usersCollection, where('username', '==', username));
    const usersSnapshot = await getDocs(queryStatement);
    if (!usersSnapshot.empty) {
      return usersSnapshot.docs[0].data().email;
    }
    return null;
  } catch (error) {
    bugsnagErrorHandler(error, 'getEmailFromUsername', { username });
  }
};

export const getNanakCoin = async (uid: string) => {
  try {
    const userRef = doc(usersCollection, uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().coins;
    }
    return null;
  } catch (error) {
    bugsnagErrorHandler(error, 'getNanakCoin', { uid });
  }
};

export const updateNanakCoin = async (uid: string, newCoinValue: number) => {
  try {
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, {
      coins: newCoinValue,
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'database/shabadavalidb/users.tsx/updateNanakCoin', {
      uid: uid,
      nanakCoin: nanakCoin,
    });
  }
};

export async function updateUserDocument(uid: string, updateData: object) {
  try {
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, updateData);
  } catch (error) {
    bugsnagErrorHandler(error, 'updateUserDocument', {
      uid: uid,
      updateData,
      location: 'database/shabadavalidb/users.tsx',
    });
  }
}

export const updateProgress = async (
  uid: string,
  currentProgress: number,
  gameSession: GameScreen[],
  currentLevel: number,
  batch: WriteBatch,
) => {
  const progress = { currentProgress, gameSession, currentLevel };
  const userRef = doc(usersCollection, uid);
  batch.update(userRef, { progress: progress });
};

export const updateNextSession = async (
  uid: string,
  gameArray: GameScreen[],
  batch: WriteBatch,
) => {
  const userRef = doc(usersCollection, uid);
  batch.update(userRef, { nextSession: gameArray });
};

export const updateCurrentProgress = async (uid: string, currentProgress: number) => {
  await updateUserDocument(uid, {
    'progress.currentProgress': currentProgress,
  });
};

export const updateCurrentLevel = async (uid: string, currentLevel: number) => {
  await updateUserDocument(uid, { 'progress.currentLevel': currentLevel });
};

export const updateLevelProgress = async (
  uid: string,
  currentLevel: number,
  currentGamePosition: number,
) => {
  await updateUserDocument(uid, {
    'progress.currentLevel': currentLevel,
    'progress.currentProgress': currentGamePosition,
  });
};

export const getUserData = async (uid: string) => {
  let retries = 0;
  const maxRetries = 3;
  while (retries < maxRetries) {
    try {
      const userRef = doc(usersCollection, uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return;
      }
      const data = userDoc.data();
      const user: User = {
        displayName: data.displayName,
        role: data.role,
        photoURL: data.photoURL,
        uid: data.uid,
        coins: data.coins,
        email: data.email,
        emailVerified: data.emailVerified,
        progress: data.progress,
        nextSession: data.nextSession,
        wordIds: data.wordIds,
        user: null,
        created_at: data.created_at,
        updated_at: data.updated_at,
        lastLogInAt: data.lastLogInAt,
        username: data.username,
      };
      return user;
    } catch (error) {
      retries++;
      console.error(`Attempt ${retries} failed: ${error}`);
      if (retries >= maxRetries) {
        bugsnagErrorHandler(error, 'getUserData', {
          uid: uid,
          location: 'database/shabadavalidb/user.tsx/',
        });
        throw new Error(`Failed to retrieve user after ${maxRetries} attempts`);
      }
    }
  }

};
