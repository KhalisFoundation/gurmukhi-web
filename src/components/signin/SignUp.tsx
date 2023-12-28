import React from 'react';
import { useTranslation } from 'react-i18next';
import InputWithIcon from 'components/input/InputWithIcon';
import { SignError } from 'types';

interface SignUpProps {
  nameChange: React.Dispatch<React.SetStateAction<string>>;
  emailChange: React.Dispatch<React.SetStateAction<string>>;
  passwordChange: React.Dispatch<React.SetStateAction<string>>;
  cpasswordChange: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: SignError | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<SignError | null>>;
}

export default function SignUp({ ...props }: SignUpProps) {
  const { t: text } = useTranslation();

  const getErrorColor = () => {
    if (!!props.errorMessage && props.errorMessage.code == 'error') {
      return 'red';
    } else {
      return 'gray';
    }
  };

  return (
    <div className='appear-from-below'>
      <InputWithIcon
        id='name'
        placeholder='Name'
        type='text'
        icon='name'
        onChange={
          (event: React.ChangeEvent<HTMLInputElement>) => props.nameChange(event.target.value)
        }
      />
      <InputWithIcon
        id='email'
        placeholder='Email'
        type='email'
        icon='email'
        onChange={
          (event: React.ChangeEvent<HTMLInputElement>) =>  props.emailChange(event.target.value)
        }
      />
      <InputWithIcon
        id='password'
        placeholder='Password'
        type='password'
        border={getErrorColor() ?? 'red'}
        onChange={
          (event: React.ChangeEvent<HTMLInputElement>) =>  props.passwordChange(event.target.value)
        }
      />
      <InputWithIcon
        id='cpassword'
        placeholder='Confirm Password'
        type='password'
        border={getErrorColor()}
        onChange={
          (event: React.ChangeEvent<HTMLInputElement>) =>  props.cpasswordChange(event.target.value)
        }
      />
      {props.errorMessage && <div className={'text-red-500 text-sm'}>{props.errorMessage.message}</div>}
      <button type='submit' className='w-full p-4 rounded-lg bg-gradient-to-r from-brightBlue to-softBlue text-white text-lg'>{text('SIGN_UP')}</button>
    </div>
  );
}
