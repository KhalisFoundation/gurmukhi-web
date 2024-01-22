/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { getUser } from 'utils';
import { logOut, userStateListener } from '../firebase';

interface Props {
  children?: ReactNode
}

export interface LocalUser {
  user: User | null,
  uid?: string,
  email?: string,
  displayName?: string,
  photoURL?: string
  role?: string,
  username?: string
}

export const AuthContext = createContext({
  // "User" comes from firebase auth-public.d.ts
  currentUser: {} as LocalUser | null,
  setCurrentUser: (_user:LocalUser) => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        const { uid, email } = user;
        const userData = getUser(email ?? '', uid)
          .then((data) => {
            const usrData = {
              user,
              uid,
              email: data?.email,
              displayName: data?.name,
              photoURL: '',
              role: data?.role,
            };
            setCurrentUser(usrData);
          });
      }
    });
    return unsubscribe;
  }, [setCurrentUser]);

  // As soon as setting the current user to null, 
  // the user will be redirected to the home page. 
  const signOut = () => {
    logOut();
    setCurrentUser(null);
  };

  const value = {
    currentUser, 
    setCurrentUser,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
