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
  Timestamp, doc, setDoc,
} from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { auth, shabadavaliDB } from '../firebase';
import { checkIfUsernameUnique, checkUser, getUserData } from 'database/shabadavalidb';
import { firebaseErrorCodes as errors } from 'constants/errors';
import roles from 'constants/roles';
import { AuthContextValue, User } from 'types';
import PageLoading from 'components/pageLoading';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactElement }) => {
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
      getUserData(userData.user.uid, (userDetails) => {
        if (!userDetails) {
          return null;
        }
        setUser(userDetails);
        setLoading(false);
      });
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

      checkUser(uid, email ?? '', async (found) => {
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
      });
      getUserData(uid, (userDetails) => {
        if (!userDetails) {
          return false;
        }

        const userData = {
          ...userCredential.user,
          role: roles.student,
          coins: userDetails.coins,
          progress: userDetails.progress,
          wordIds: userDetails.wordIds,
          user: userCredential.user,
          learntWordIds: userDetails.learntWordIds ?? [],
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
          lastLogInAt: Timestamp.now(),
        } as User;
        setUser(userData);
        setLoading(false);
        return true;
      });
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
      checkIfUsernameUnique(username, (unique) => {
        if (!unique) {
          showToastMessage(translate('USERNAME_TAKEN'));
          return false;
        }
      });
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
        learntWordIds: [],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        lastLogInAt: Timestamp.now(),
        user: null as FirebaseUser | null,
      };
      await setDoc(localUser, userDataForState);

      userDataForState = { ...userDataForState, user: userData };
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
        getUserData(uid, (userDetails) => {
          if (!userDetails) {
            return null;
          }
          const usr = {
            user: currentUser,
            uid,
            // name: userDetails?.name,
            coins: userDetails?.coins,
            progress: userDetails?.progress,
            email: userDetails?.email,
            emailVerified: emailVerified ?? false,
            displayName: userDetails?.displayName,
            photoURL: '',
            role: userDetails?.role,
            username: userDetails?.username,
            created_at: metadata.creationTime,
            updated_at: Timestamp.now(),
            lastLogInAt: metadata.lastSignInTime,
            wordIds: userDetails?.wordIds || [],
          } as User;
          setUser(usr);
          setLoading(false);
        });
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
