import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserAuth } from 'auth';
import { ROUTES } from 'constants/routes';
import { bugsnagErrorHandler, showToastMessage } from 'utils';
import { useAppSelector } from 'store/hooks';
import { logSessionTime } from 'utils/analytics';

export default function LogOut() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { logOut } = useUserAuth();
  const { t: text } = useTranslation();
  const sessionStart = useAppSelector((state) => state.sessionStart);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logOut();
        const sessionEnd = Date.now();
        const sessionDuration = sessionEnd - sessionStart;
        logSessionTime(sessionDuration);
        navigate(ROUTES.LOGIN);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'An Unknown Error Occurred';
        setErrorMessage(errorMsg);
        showToastMessage(errorMsg, toast.POSITION.BOTTOM_RIGHT, true, true);
        bugsnagErrorHandler(error, 'handleLogut', {});
      }
    };
    handleLogout();
  }, []);

  return errorMessage ? <ToastContainer /> : <h2>{text('LOGGING_OUT')}</h2>;
}
