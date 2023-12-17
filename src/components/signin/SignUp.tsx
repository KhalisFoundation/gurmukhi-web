import React from 'react';
import { useTranslation } from 'react-i18next';
import InputWithIcon from 'components/input/InputWithIcon';

export default function SignUp() {
  const { t: text } = useTranslation();
  return (
    <div className='appear-from-below'>
      <InputWithIcon id='name' placeholder='Name' type='text' icon='name' />
      <InputWithIcon id='email' placeholder='Email' type='email' icon='email' />
      <InputWithIcon id='password' placeholder='Password' type='password' />
      <InputWithIcon id='cpassword' placeholder='Confirm Password' type='password' />
      <button type='submit' className='w-full p-4 rounded-lg bg-gradient-to-r from-brightBlue to-softBlue text-white text-lg'>{text('SIGN_UP')}</button>
    </div>
  );
}
