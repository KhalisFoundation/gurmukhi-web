import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import { useAppSelector } from 'store/hooks';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useAppSelector((state) => state.userData);
  const location = useLocation();

  if (user === null) {
    // Redirect the user to the login page.
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}
