import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserAuth } from 'auth';
import { ROUTES } from 'constants/routes';

export default function LogOut() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { logOut } = useUserAuth();
  const { t: text } = useTranslation();

  const showToastMessage = () => {
    toast.success(errorMessage, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeOnClick: true,
      type: 'error'
    });
  };

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logOut();
        navigate(ROUTES.LOGIN);
      } catch (error: any) {
        setErrorMessage(error.message);
        showToastMessage();
      }
    };
    handleLogout();
  }, []);

  return (
    errorMessage ? <ToastContainer /> 
      : <h2>{text('LOGGING_OUT')}</h2>
  );
}
