import {
  collection,
  doc,
  documentId,
  onSnapshot,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { shabadavaliDB as db } from '../../firebase';
import { GameScreen, User } from 'types';
import { bugsnagErrorHandler } from 'utils';
import nanakCoin from 'store/features/nanakCoin';

export const usersCollection = collection(db, 'users');

export const getUser = (email: string, uid: string, callback: (user: any) => void) => {
  console.log('function getUser');
  try {
    const userRef = doc(usersCollection, uid);
    return onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const user = userDoc.data();
        if (user.email === email) {
          callback(user);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    }, (error) => {
      bugsnagErrorHandler(error, 'getUser', { email, uid });
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'getUser', { email, uid });
  }
};

export const checkUser = (uid: string, email: string, callback: (exists: boolean) => void) => {
  console.log('function checkUser');
  try {
    const queryStatement = query(
      usersCollection,
      where(documentId(), '==', uid),
      where('email', '==', email),
    );
    return onSnapshot(queryStatement, (usersSnapshot) => {
      callback(!usersSnapshot.empty);
    }, (error) => {
      bugsnagErrorHandler(error, 'checkUser', { uid, email });
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'checkUser', { uid, email });
  }
};

export const checkIfUsernameUnique = (username: string, callback: (isUnique: boolean) => void) => {
  console.log('function checkIfUsernameUnique');
  try {
    const queryStatement = query(usersCollection, where('username', '==', username));
    return onSnapshot(queryStatement, (usersSnapshot) => {
      callback(usersSnapshot.empty);
    }, (error) => {
      bugsnagErrorHandler(error, 'checkIfUserNameUnique', { username });
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'checkIfUserNameUnique', { username });
  }
};

export const checkIfEmailUnique = (email: string, callback: (isUnique: boolean) => void) => {
  console.log('function checkIfEmailUnique');
  try {
    const queryStatement = query(usersCollection, where('email', '==', email));
    return onSnapshot(queryStatement, (usersSnapshot) => {
      callback(usersSnapshot.empty);
    }, (error) => {
      bugsnagErrorHandler(error, 'checkIfEmailUnique', { email });
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'checkIfEmailUnique', { email });
  }
};

export const getEmailFromUsername = (username: string, callback: (email: string | null) => void) => {
  console.log('function getEmailFromUsername');
  try {
    const queryStatement = query(usersCollection, where('username', '==', username));
    return onSnapshot(queryStatement, (usersSnapshot) => {
      if (!usersSnapshot.empty) {
        callback(usersSnapshot.docs[0].data().email);
      } else {
        callback(null);
      }
    }, (error) => {
      bugsnagErrorHandler(error, 'getEmailFromUsername', { username });
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'getEmailFromUsername', { username });
  }
};

export const getNanakCoin = (uid: string, callback: (coins: number | null) => void) => {
  console.log('function getNanakCoin');
  try {
    const userRef = doc(usersCollection, uid);
    return onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        callback(userDoc.data().coins);
      } else {
        callback(null);
      }
    }, (error) => {
      bugsnagErrorHandler(error, 'getNanakCoin', { uid });
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'getNanakCoin', { uid });
  }
};

export const updateNanakCoin = async (uid: string, newCoinValue: number) => {
  console.log('function updateNanakCoin');
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
  console.log('function updateUserDocument');
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
  console.log('function updateProgress');
  const progress = { currentProgress, gameSession, currentLevel };
  await updateUserDocument(uid, { progress });
  console.log('Document is updated successfully');
};

export const updateNextSession = async (uid: string, gameArray: GameScreen[]) => {
  console.log('function updateNextSession');
  await updateUserDocument(uid, { next_session: gameArray });
};

export const updateCurrentProgress = async (uid: string, currentProgress: number) => {
  console.log('function updateCurrentProgress');
  await updateUserDocument(uid, {
    'progress.currentProgress': currentProgress,
  });
};

export const updateCurrentLevel = async (uid: string, currentLevel: number) => {
  console.log('function updateCurrentLevel');
  await updateUserDocument(uid, { 'progress.currentLevel': currentLevel });
};

export const updateLevelProgress = async (
  uid: string,
  currentLevel: number,
  currentGamePosition: number,
) => {
  console.log('function updateLevelProgress');
  await updateUserDocument(uid, {
    'progress.currentLevel': currentLevel,
    'progress.currentProgress': currentGamePosition,
  });
};

export const getUserData = (uid: string, callback: (user: User | undefined) => void) => {
  console.log('function getUserData');
  try {
    const userRef = doc(usersCollection, uid);
    return onSnapshot(userRef, (userDoc) => {
      if (!userDoc.exists()) {
        callback(undefined);
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
        nextSession: data.next_session,
        wordIds: data.wordIds,
        learntWordIds: data.learntWordIds,
        user: null,
        created_at: data.created_at,
        updated_at: data.updated_at,
        lastLogInAt: data.lastLogInAt,
        username: data.username,
      };
      callback(user);
    }, (error) => {
      bugsnagErrorHandler(error, 'getUserData', {
        uid: uid,
        location: 'database/shabadavalidb/user.tsx/',
      });
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'getUserData', {
      uid: uid,
      location: 'database/shabadavalidb/user.tsx/',
    });
  }
};
