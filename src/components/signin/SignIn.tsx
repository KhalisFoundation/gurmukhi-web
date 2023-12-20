import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from 'auth';
import { ROUTES } from 'constants/routes';
import SignUp from './SignUp';
import InputWithIcon from '../input/InputWithIcon';
import { SignError } from 'types';
import { ToastContainer, toast } from 'react-toastify';

export default function SignIn() {
  const { t: text } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<SignError | null>(null);
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const { logIn, signUp, signInWithGoogle } = useUserAuth();

  const showToastMessage = (textMsg: string, error = true) => {
    toast.success(textMsg, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeOnClick: true,
      type: error ? 'error' : 'success',
    });
  };

  useEffect(() => {
    if (password === '' && cpassword === '') {
      setErrorMessage(null);
    } else if (password === cpassword && password !== '' && cpassword !== '') {
      setErrorMessage({
        code: 'pwd-match',
        message: 'Passwords match',
      });
    } else {
      setErrorMessage({
        code: 'pwd-mismatch',
        message: 'Passwords do not match',
      });
    }
  }, [password, cpassword]);

  const signToggle = (e: FormEvent) => {
    e.preventDefault();
    const switchElement = document.getElementsByClassName('switch')[0];
    
    if (switchElement?.classList.contains('left-[4px]')) {
      switchElement.classList.toggle('translate-x-[94%]');
    } else {
      switchElement.classList.toggle('translate-x-[94%]');
    }
    setIsNewUser(!isNewUser);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const username = email.split('@')[0];
      if (isNewUser) {
        if (password === cpassword) {
          const success = await signUp(name, username, email, password, cpassword, showToastMessage);
          if (success) {
            navigate(ROUTES.DASHBOARD);
          } 
        } else {
          setErrorMessage({
            code: 'pwd-mismatch',
            message: 'Passwords do not match',
          });
        }
      } else {
        const success = await logIn(username, password, showToastMessage);
        if (success) {
          navigate(ROUTES.DASHBOARD);
        }
      }
    } catch (error: any) {
      showToastMessage(error.message);
    }
  };

  const handleGoogleSignIn = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      const success = await signInWithGoogle();
      if (success) {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error: any) {
      showToastMessage(error.message);
    }
  };

  return (
    <main className="flex bg-white h-full w-[45rem] rounded-3xl flex-col justify-center items-center py-20 px-32 gap-5 brandon-grotesque">
      <div className='text-center'>
        <h1 className='fs-rem-2 recoleta'>{text('WELCOME')}</h1>
        <h3 className='grey text-lg'>{text('ENTER_DETAILS')}</h3>
      </div>

      <div className="w-60 mx-8 rounded-full h-12 mt-4 flex p-5 relative items-center justify-between gap-4 bg-gray-eee">
        <div className="w-full flex justify-center grey">
          <button className='signin' onClick={(e) => signToggle(e)}>{text('SIGN_IN')}</button>
        </div>
        <div className="w-full flex justify-center grey">
          <button className='signup' onClick={(e) => signToggle(e)}>{text('SIGN_UP')}</button>
        </div>
        <span className="switch bg-white shadow text-black flex items-center justify-center w-1/2 rounded-full h-10 transition-all top-[4px] absolute left-[4px]">
          {isNewUser ? text('SIGN_UP') : text('SIGN_IN')}
        </span>
      </div>

      <ToastContainer />

      <form onSubmit={handleSubmit} className='flex flex-col w-full gap-4 mt-4 ease-in-out duration-200 delay-100' >
        {isNewUser ? (
          <SignUp
            nameChange={setName}
            emailChange={setEmail}
            passwordChange={setPassword}
            cpasswordChange={setCPassword}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )
          : (
            <div className='appear-from-below'>
              <InputWithIcon id="username" placeholder="Username (same as your email)" type="text" icon="user" onChange={(e) => setEmail(e.target.value)} />
              <InputWithIcon id="spassword" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
              <button className="w-full p-4 rounded-lg bg-gradient-to-r from-brightBlue to-softBlue text-white text-lg" type='submit'>{text('SIGN_IN')}</button>
            </div>
          )
        }
        <div className="flex justify-center items-center grey">
          <div className="w-1/4 h-[1px] bg-stone-950/[.2] mr-1"></div>
          {text('OR').toUpperCase()}
          <div className="w-1/4 h-[1px] bg-stone-950/[.2] ml-1"></div>
        </div>
        <button 
          className="w-full flex p-4 rounded-lg bg-transparent hover:bg-slate-100 text-black text-lg items-center justify-center gap-4 border border-gray-300"
          onClick={(e) => handleGoogleSignIn(e)}
        >
          <img className="w-6 h-6" src="/icons/google.svg" alt="google" />
          {text('SIGN_IN_WITH_GOOGLE')}
        </button>
      </form>

    </main>
  );
}
