import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserAuth } from 'auth';
import { ROUTES } from 'constants/routes';
import { showToastMessage } from 'utils';

export default function LogOut() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { logOut } = useUserAuth();
  const { t: text } = useTranslation();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logOut();
        navigate(ROUTES.LOGIN);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
          showToastMessage(error.message, toast.POSITION.BOTTOM_RIGHT, true, true);
        } else {
          setErrorMessage('An unknown error occurred');
          showToastMessage('An unknown error occurred', toast.POSITION.BOTTOM_RIGHT, true, true);
        }
      }
    };
    handleLogout();
  }, []);

  return (
    errorMessage ? <ToastContainer /> 
      : <h2>{text('LOGGING_OUT')}</h2>
  );
}
