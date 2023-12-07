import React, { useContext } from 'react';
import { AuthContext } from '@/auth/context';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function RequireAuth({ children }: { children:JSX.Element }) {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) {
    // Redirect the user to the login page.
    return <Navigate to={ROUTES.LOGIN} state={ { from: location } } replace />;
  }

  return children;
}
