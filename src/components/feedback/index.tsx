import React, { useState } from 'react';
import { useUserAuth } from 'auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { SignError } from 'types';

function FeedbackForm() {
    const { t: text } = useTranslation();
    const { user } = useUserAuth();
    
    const [name, setName] = useState(user.displayName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<SignError | null>(null);
    const navigate = useNavigate();
  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      action='https://submit.jotform.com/submit/240394066555864'
    >
    </form>
  )
}

export default FeedbackForm