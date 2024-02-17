import React, { useState } from 'react';
import { useUserAuth } from 'auth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { SignError } from 'types';
import InputWithIcon from 'components/input/InputWithIcon';

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
      <InputWithIcon
        id="input_11"
        name="q11_name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={text('NAME')}
        icon="user"
      />
      <InputWithIcon
        id="input_13"
        name="q13_email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={text('EMAIL')}
        icon="email"
      />
    </form>
  )
}

export default FeedbackForm;
