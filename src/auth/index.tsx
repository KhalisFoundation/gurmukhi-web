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
} from 'firebase/auth';
import {
  Timestamp, doc, setDoc, // query, where, documentId, getDocs,
} from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { auth, firestore } from '../firebase';
import { checkIfUsernameUnique, checkUser, getUser } from 'utils';
import { firebaseErrorCodes as errors } from 'constants/errors';
import roles from 'constants/roles';

const UserAuthContext = createContext<any>(null);

export const UserAuthContextProvider = ({ children }: { children:ReactElement }) => {
  const [user, setUser] = useState({});
  const { t: text } = useTranslation();

  const logIn = async (
    email: string,
    password: string,
    showToastMessage: (text: string, error?: boolean) => void,
  ) => signInWithEmailAndPassword(auth, email, password).catch((error: any) => {
    if (Object.keys(errors).includes(error.code)) {
      showToastMessage(errors[error.code]);
    } else {
      showToastMessage(text('ERROR') + error.code + error.message);
    }
    return null;
  });

  const signInWithGoogle = async (
    showToastMessage: (text: string, error?: boolean) => void,
  ) => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((userCredential) => {
        const { uid, email, displayName } = userCredential.user;
        return checkUser(uid, email ?? '').then((found) => {
          if (!found) {
            const localUser = doc(firestore, `users/${uid}`);
            setDoc(localUser, {
              role: roles.student,
              email,
              displayName: displayName ?? email?.split('@')[0],
              created_at: Timestamp.now(),
              updated_at: Timestamp.now(),
            }).then(() => true);
          } else {
            return true;
          }
          setUser(userCredential.user);
        });
      }).catch((error: any) => {
        if (Object.keys(errors).includes(error.code)) {
          showToastMessage(errors[error.code]);
        }
        return false;
      });
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
      const found = checkIfUsernameUnique(username);
      if (!found) {
        showToastMessage(text('USERNAME_TAKEN'));
        return false;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;
      const { uid, displayName } = userData;
      const localUser = doc(firestore, `users/${uid}`);
      await setDoc(localUser, {
        name,
        role: roles.student,
        email,
        username,
        displayName: displayName ?? name,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
      setUser(userData);

      sendEmailVerification(auth.currentUser ?? userData).then(() => {
        showToastMessage(text('EMAIL_VERIFICATION_SENT'), false);
      });
      return true;
    } catch (error: any) {
      if (Object.keys(errors).includes(error.code)) {
        showToastMessage(errors[error.code]);
      }
      return false;
    }
  };

  const logOut = () => signOut(auth);

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser: any) => {
      if (currentuser !== null) {
        const { uid, email } = currentuser;
        getUser(email ?? '', uid)
          .then((data) => {
            const usr = {
              user,
              uid,
              email: data?.email,
              displayName: data?.displayName,
              photoURL: '',
              role: data?.role,
            };
            setUser(usr);
          });
      }
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserAuthContext.Provider value={{
      user, logIn, signUp, logOut, signInWithGoogle, resetPassword,
    }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
