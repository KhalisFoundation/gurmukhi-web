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
import {
  checkIfUsernameUnique,
  checkUser,
  getUser,
} from 'database/shabadavalidb';
import { firebaseErrorCodes as errors } from 'constants/errors';
import roles from 'constants/roles';
import { AuthContextValue } from 'types';
import { User } from 'types/shabadavalidb';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const { t: text } = useTranslation();

  const logIn = async (
    email: string,
    password: string,
    showToastMessage: (text: string, error?: boolean) => void,
  ) =>
    signInWithEmailAndPassword(auth, email, password).catch((error: any) => {
      if (Object.keys(errors).includes(error.code)) {
        showToastMessage(errors[error.code]);
      } else {
        showToastMessage(text('ERROR') + error.code + error.message);
      }
      return null;
    });

  const signInWithGoogle = async (showToastMessage: (text: string, error?: boolean) => void) => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { uid, email, displayName } = userCredential.user;

      const found = await checkUser(uid, email ?? '');

      if (!found) {
        const localUser = doc(shabadavaliDB, `users/${uid}`);
        await setDoc(localUser, {
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
        });
      }

      const userData = {
        ...userCredential.user,
        role: roles.student,
        coins: 0,
        progress: {
          currentProgress: 0,
          gameSession: [],
          currentLevel: 0,
        },
        wordIds: [],
        user: userCredential.user,
      } as User;

      setUser(userData);
      return true;
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
        showToastMessage(text('PASSWORDS_DONT_MATCH'));
        return false;
      }
      const unique = checkIfUsernameUnique(username);
      if (!unique) {
        showToastMessage(text('USERNAME_TAKEN'));
        return false;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;
      const { uid, displayName } = userData;
      const localUser = doc(shabadavaliDB, `users/${uid}`);
      let userDataForState = {
        uid,
        name,
        role: roles.student,
        email,
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
        user: null as FirebaseUser | null,
      };
      await setDoc(localUser, userDataForState);

      userDataForState = { ...userDataForState, user: userData };
      setUser(userDataForState);

      sendEmailVerification(auth.currentUser ?? userData).then(() => {
        showToastMessage(text('EMAIL_VERIFICATION_SENT'), false);
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

  const logOut = () => signOut(auth);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      if (currentUser !== null) {
        const { uid, email, emailVerified, metadata } = currentUser as FirebaseUser;
        getUser(email ?? '', uid).then((data) => {
          const usr = {
            user: currentUser,
            uid,
            name: data?.name,
            coins: data?.coins,
            progress: data?.progress,
            email: data?.email,
            emailVerified: emailVerified ?? false,
            displayName: data?.displayName,
            photoURL: '',
            role: data?.role,
            username: data?.username,
            createdAt: metadata.creationTime,
            lastLogInAt: metadata.lastSignInTime,
            wordIds: data?.wordIds || [],
          } as User;
          setUser(usr);
        });
      }
      setUser(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

export const useUserAuth = () => useContext(AuthContext);
