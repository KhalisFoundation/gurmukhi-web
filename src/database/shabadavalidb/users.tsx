import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
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
) => {
  const progress = { currentProgress, gameSession, currentLevel };
  await updateUserDocument(uid, { progress });
  console.log('Document is updated successfully');
};

export const updateNextSession = async (uid: string, gameArray: GameScreen[]) => {
  await updateUserDocument(uid, { next_session: gameArray });
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
      progress: data.progress,
      nextSession: data.next_session,
      wordIds: data.wordIds,
      user: null,
    };
    return user;
  } catch (error) {
    bugsnagErrorHandler(error, 'getUserData', {
      uid: uid,
      location: 'database/shabadavalidb/user.tsx/',
    });
  }
};
