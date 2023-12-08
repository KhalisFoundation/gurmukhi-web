import React, { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  Timestamp, doc, setDoc, // query, where, documentId, getDocs,
} from 'firebase/firestore';
import { auth, firestore } from 'firebase';
import { checkUser, getUser } from 'utils/users';
import { firebaseErrorCodes as errors } from 'constants/errors';
import roles from 'constants/roles';
import { useTranslation } from 'react-i18next';

const userAuthContext = createContext<any>(null);

export const UserAuthContextProvider = ({ children }: { children:ReactElement }) => {
  const { t: text } = useTranslation();
  const [user, setUser] = useState({});

  const logIn = (
    email: string,
    password: string,
  ) => signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = async () => {
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
          alert(errors[error.code]);
        }
        return false;
      });
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      if (password !== confirmPassword) {
        alert(text('PASSWORDS_DONT_MATCH'));
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
        displayName: displayName ?? name,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
      setUser(userData);

      sendEmailVerification(auth.currentUser ?? userData).then(() => {
        alert(text('EMAIL_VERIFICATION_SENT'));
      });
      return true;
    } catch (error: any) {
      if (Object.keys(errors).includes(error.code)) {
        alert(errors[error.code]);
      }
      return false;
    }
  };

  const logOut = () => signOut(auth);

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
    <userAuthContext.Provider value={{
      user, logIn, signUp, logOut, signInWithGoogle,
    }}
    >
      {children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(userAuthContext);
