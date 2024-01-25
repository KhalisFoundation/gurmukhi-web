import {
  DocumentReference,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  updateDoc,
} from 'firebase/firestore';
import { UserProfile } from 'firebase/auth';
import { shabadavaliDB as db } from '../../firebase';
import { GameScreen } from 'types/shabadavlidb';

export const usersCollection = collection(db, 'users');

export const getUser = async (email: string, uid: string) => {
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
};

export const updateUser = async (
  userRef: DocumentReference,
  userData: UserProfile,
) => {
  const updatedUser = await setDoc(userRef, {
    ...userData,
  });
  return updatedUser;
};

export const checkUser = async (uid: string, email: string) => {
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
};

export const checkIfUsernameUnique = async (username: string) => {
  const queryStatement = query(
    usersCollection,
    where('username', '==', username),
  );
  const usersSnapshot = await getDocs(queryStatement);
  return usersSnapshot.empty;
};

export const checkIfEmailUnique = async (email: string) => {
  const queryStatement = query(usersCollection, where('email', '==', email));
  const usersSnapshot = await getDocs(queryStatement);
  return usersSnapshot.empty;
};

export const getEmailFromUsername = async (username: string) => {
  const queryStatement = query(
    usersCollection,
    where('username', '==', username),
  );
  const usersSnapshot = await getDocs(queryStatement);
  if (!usersSnapshot.empty) {
    return usersSnapshot.docs[0].data().email;
  }
  return null;
};

export const updateNanakCoin = async (uid: string, newCoinValue: number) => {
  try {
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, {
      coins: newCoinValue,
    });
  } catch (error) {
    console.error('Error: Unable to update the coin', error);
  }
};

async function updateUserDocument(uid: string, updateData: object) {
  try {
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error(`Error updating user document (UID: ${uid}):`, error);
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

export const updateCurrentProgress = async (
  uid: string,
  currentProgress: number,
) => {
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