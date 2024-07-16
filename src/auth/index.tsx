import React, { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  Timestamp, doc, setDoc, // query, where, documentId, getDocs,
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
import { addNextScreens, resetNextSession } from 'store/features/nextSessionSlice';
import { useAppDispatch } from 'store/hooks';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactElement }) => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { t: translate } = useTranslation();

  const logIn = async (
    email: string,
    password: string,
    showToastMessage: (text: string, error?: boolean) => void,
  ) => {
    try {
      const userData = await signInWithEmailAndPassword(auth, email, password);
      if (!userData.user.uid) {
        return null;
      }
      const userDetails = await getUserData(userData.user.uid);
      if (!userDetails) return null;
      if (userData.user.uid) await setWordIds(userData.user.uid);
      setUser(userDetails);
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
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { uid, email, displayName } = userCredential.user;
      if (!email || !displayName) {
        return false;
      }

      const found = await checkUser(uid, email ?? '');

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
          displayName: displayName ?? (email?.split('@')[0] || ''),
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        };
        await setDoc(localUser, userData);
        const userDetails: User = {
          ...userData,
          user: userCredential.user,
          emailVerified: userCredential.user.emailVerified,
          photoURL: '',
          uid: uid,
          wordIds: [],
          lastLogInAt: Timestamp.now(),
        };
        if (uid) await setWordIds(uid);
        dispatch(setCurrentGamePosition(0));
        dispatch(setCurrentLevel(0));
        dispatch(setNanakCoin(0));
        dispatch(addScreens([]));
        dispatch(resetNextSession());
        
        setUser(userDetails);
        setLoading(false);
        return true;
      } else {
        const userDetails = await getUserData(uid);
        if (!userDetails) return false;

        const userData = {
          ...userCredential.user,
          role: roles.student,
          coins: userDetails.coins,
          progress: userDetails.progress,
          wordIds: userDetails.wordIds,
          user: userCredential.user,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
          lastLogInAt: Timestamp.now(),
        } as User;

        if (userData.uid) await setWordIds(userData.uid);
        setUser(userData);
        setLoading(false);
        return true;
      }

    
    } catch (error) {
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
      setUser(userDataForState);
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
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
      if (currentUser !== null) {
        const { uid, emailVerified, metadata } = currentUser as FirebaseUser;
        const userDetails = await getUserData(uid);
        if (!userDetails) {
          return null;
        }
        const usr = {
          user: currentUser,
          uid,
          // name: userDetails?.name,
          coins: userDetails.coins,
          progress: userDetails.progress,
          email: userDetails.email,
          emailVerified: emailVerified ?? false,
          displayName: userDetails.displayName,
          photoURL: userDetails.photoURL,
          role: userDetails.role,
          username: userDetails.username,
          created_at: metadata.creationTime,
          updated_at: Timestamp.now(),
          lastLogInAt: metadata.lastSignInTime,
          wordIds: userDetails.wordIds || [],
          nextSession: userDetails.nextSession,
        } as User;
        dispatch(setCurrentGamePosition(usr.progress.currentProgress));
        dispatch(setCurrentLevel(usr.progress.currentLevel));
        dispatch(setNanakCoin(usr.coins));
        dispatch(addScreens(usr.progress.gameSession));
        dispatch(addNextScreens(usr.nextSession ?? []));
        // if nextSession has some value and gameSession is empty then add nextSession to gameSession
        if (usr.nextSession && usr.progress.gameSession.length === 0 && usr.nextSession.length > 0) {
          dispatch(addScreens(usr.nextSession));
          dispatch(resetNextSession());
        }
        setUser(usr);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
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
