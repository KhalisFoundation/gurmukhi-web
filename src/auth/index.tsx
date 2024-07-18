import React, { ReactElement, createContext, useContext, useState } from 'react';
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  Timestamp,
  doc,
  setDoc, // query, where, documentId, getDocs,
} from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { auth, shabadavaliDB } from '../firebase';
import { checkIfUsernameUnique, checkUser, getUserData, setWordIds } from 'database/shabadavalidb';
import { firebaseErrorCodes as errors } from 'constants/errors';
import roles from 'constants/roles';
import { AuthContextValue, User } from 'types';
import PageLoading from 'components/pageLoading';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { setCurrentLevel } from 'store/features/currentLevelSlice';
import { setNanakCoin } from 'store/features/nanakCoin';
import { addScreens } from 'store/features/gameArraySlice';
import { addNextScreens } from 'store/features/nextSessionSlice';
import { useAppDispatch } from 'store/hooks';
import { setUserData } from 'store/features/userDataSlice';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactElement }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const { t: translate } = useTranslation();

  const dispatchActions = (userDetails: User) => {
    dispatch(setCurrentGamePosition(userDetails.progress.currentProgress));
    dispatch(setCurrentLevel(userDetails.progress.currentLevel));
    dispatch(setNanakCoin(userDetails.coins));
    dispatch(addScreens(userDetails.progress.gameSession));
    console.log('next session from user: ', userDetails.nextSession);
    dispatch(addNextScreens(userDetails.nextSession ?? []));
    dispatch(setUserData(userDetails));
  };

  const logIn = async (
    email: string,
    password: string,
    showToastMessage: (text: string, error?: boolean) => void,
  ) => {
    try {
      setLoading(true);
      const userData = await signInWithEmailAndPassword(auth, email, password);
      if (!userData.user.uid) {
        setLoading(false);
        return null;
      }
      const userDetails = await getUserData(userData.user.uid);
      if (!userDetails) return null;
      if (userData.user.uid) await setWordIds(userData.user.uid);
      dispatchActions(userDetails);
      setLoading(false);
      return userData;
    } catch (error) {
      if (error instanceof Error) {
        if (Object.keys(errors).includes(error.name)) {
          showToastMessage(errors[error.name]);
        } else {
          showToastMessage(translate('ERROR') + error.name + error.message);
        }
      }
      return null;
    }
  };

  const signInWithGoogle = async (showToastMessage: (text: string, error?: boolean) => void) => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { uid, email, displayName } = userCredential.user;
      if (!email) {
        showToastMessage('Email is missing.', true);
        setLoading(false);
        return false;
      }

      const found = await checkUser(uid, email);

      if (!found) {
        const localUser = doc(shabadavaliDB, `users/${uid}`);
        const userData = {
          role: roles.student,
          email,
          coins: 0,
          progress: {
            currentProgress: 0,
            gameSession: [],
            currentLevel: 0,
          },
          displayName: displayName ?? email?.split('@')[0],
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
          emailVerified: userCredential.user.emailVerified,
          photoURL: userCredential.user.photoURL || '',
          uid: uid,
          wordIds: [],
          lastLogInAt: Timestamp.now(),
        };
        await setDoc(localUser, userData);
        const userDetails: User = {
          ...userData,
          user: null,
        };
        if (uid) await setWordIds(uid);
        dispatchActions(userDetails);
      } else {
        const userDetails = await getUserData(uid);
        if (!userDetails) {
          showToastMessage('Failed to retrieve existing user data', true);
          return false;
        }

        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          role: roles.student,
          coins: userDetails.coins,
          progress: userDetails.progress,
          wordIds: userDetails.wordIds,
          nextSession: userDetails.nextSession || [],
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
          lastLogInAt: Timestamp.now(),
        } as User;

        if (userData.uid) await setWordIds(userData.uid);
        dispatchActions(userData);
      }
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        if (Object.keys(errors).includes(error.message)) {
          showToastMessage(errors[error.message]);
        }
      }
      return false;
    }
  };

  const signUp = async (
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    showToastMessage: (text: string, error?: boolean) => void,
  ) => {
    try {
      if (password !== confirmPassword) {
        showToastMessage(translate('PASSWORDS_DONT_MATCH'));
        return false;
      }
      const unique = await checkIfUsernameUnique(username);
      if (!unique) {
        showToastMessage(translate('USERNAME_TAKEN'));
        return false;
      }
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;
      const { uid, displayName } = userData;
      const localUser = doc(shabadavaliDB, `users/${uid}`);
      let userDataForState = {
        uid,
        name,
        role: roles.student,
        email,
        emailVerified: false,
        username,
        displayName: displayName || name,
        wordIds: [],
        photoURL: '',
        coins: 0,
        progress: {
          currentProgress: 0,
          gameSession: [],
          currentLevel: 0,
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        lastLogInAt: Timestamp.now(),
        user: null as FirebaseUser | null,
      };
      await setDoc(localUser, userDataForState);

      userDataForState = { ...userDataForState, user: userData };
      if (userData.uid) await setWordIds(userData.uid);
      dispatchActions(userDataForState);
      setLoading(false);

      sendEmailVerification(auth.currentUser ?? userData).then(() => {
        showToastMessage(translate('EMAIL_VERIFICATION_SENT'), false);
      });
      return true;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const errorCode = (error as { code: string }).code;

        if (Object.keys(errors).includes(errorCode)) {
          showToastMessage(errors[errorCode]);
        }
      }
      return false;
    }
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    dispatch(setUserData(null));
    setLoading(false);
  };

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <AuthContext.Provider
      value={{
        logIn,
        signUp,
        logOut,
        signInWithGoogle,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(AuthContext) as AuthContextValue;
