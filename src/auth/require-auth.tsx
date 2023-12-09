import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import { useUserAuth } from 'auth';
import { User } from 'firebase/auth';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useUserAuth() as { currentUser: User };
  const location = useLocation();

  if (!currentUser) {
    // Redirect the user to the login page.
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}
