import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from 'auth';

export default function LogOut() {
  const { t: text } = useTranslation();
  const navigate = useNavigate();
  const { logOut } = useUserAuth();
  
  useEffect(() => {
    logOut().then(() => {
      navigate('/');
    });
  }, []);

  return (
    <div>{text('LOGGING_OUT')}</div>
  );
}
