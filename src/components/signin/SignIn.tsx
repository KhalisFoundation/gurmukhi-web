import React, { FormEvent, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from 'auth';
import { ROUTES } from 'constants/routes';
import { SignError } from 'types';
import { ToastContainer, toast } from 'react-toastify';
import { bugsnagErrorHandler, showToastMessage } from 'utils';
import { useAppSelector } from 'store/hooks';
const SignUp = lazy(() => import('./SignUp'));
const InputWithIcon = lazy(() => import('../input/InputWithIcon'));

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
  const user = useAppSelector((state) => state.userData);

  useEffect(() => {
    if (user) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [user]);

  const displayToast = (textMsg: string, error = true) => {
    showToastMessage(textMsg, toast.POSITION.BOTTOM_RIGHT, true, error);
  };

  const signToggle = (e: FormEvent) => {
    e.preventDefault();

    const switchElement = document.getElementsByClassName('switch')[0] as HTMLElement | null;
    if (switchElement !== null) {
      switchElement.classList.toggle('translate-x-[94%]');
    } else {
      bugsnagErrorHandler(new Error('Switch element not found'), 'SwitchSignInToggle', {});
    }
    setIsNewUser(!isNewUser);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const username = email.split('@')[0];
      let valid = true;
      if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        valid = false;
        setErrorMessage({
          code: text('ERROR'),
          message: text('ENTER_VALID_EMAIL'),
        });
      } else if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {
        valid = false;
        setErrorMessage({
          code: text('ERROR'),
          message: text('ERROR_PWD'),
        });
      } else {
        valid = true;
        setErrorMessage(null);
      }

      if (isNewUser) {
        if (password !== cpassword && password !== '' && cpassword !== '') {
          valid = false;
          setErrorMessage({
            code: text('ERROR'),
            message: text('PASSWORDS_DONT_MATCH'),
          });
        }

        if (name === '' || username == '' || email === '' || password === '') {
          valid = false;
          setErrorMessage({
            code: text('ERROR'),
            message: text('FILL_ALL_FIELDS'),
          });
        }

        if (valid) setErrorMessage(null);
        else return;

        if (password === cpassword) {
          const success = await signUp(name, username, email, password, cpassword, displayToast);
          if (success) {
            navigate(ROUTES.DASHBOARD);
          }
        } else {
          setErrorMessage({
            code: text('ERROR'),
            message: text('PASSWORDS_DONT_MATCH'),
          });
        }
      } else {
        if (email === '' || password === '') {
          valid = false;
          setErrorMessage({
            code: text('ERROR'),
            message: text('FILL_ALL_FIELDS'),
          });
        }

        if (valid) setErrorMessage(null);
        else return;

        const success = await logIn(email, password, displayToast);
        if (success) {
          navigate(ROUTES.DASHBOARD);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        displayToast(error.message);
      }
    }
  };

  const handleGoogleSignIn = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      const success = await signInWithGoogle(displayToast);
      if (success) {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      if (error instanceof Error) {
        displayToast(error.message);
      }
    }
  };

  return (
    <main className='bg-white lg:h-full rounded-3xl brandon-grotesque w-5/6 xl:w-1/3 self-center'>
      <div className='flex flex-col w-2/3 m-auto my-0 h-full justify-center'>
        <div className='flex flex-col my-4 gap-4 xl:gap-0 h-auto overflow-y-auto'>
          <div className='flex flex-col gap-4'>
            <div className='text-center'>
              <h1 className='fs-rem-2 recoleta'>{text('WELCOME')}</h1>
              <h3 className='grey text-lg'>{text('ENTER_DETAILS')}</h3>
            </div>

            <div className='w-3/4 m-auto rounded-full h-12 flex p-5 relative items-center justify-between gap-4 bg-gray-eee'>
              <div className='w-full flex justify-center grey'>
                <button className='signin' onClick={(e) => signToggle(e)}>
                  {text('SIGN_IN')}
                </button>
              </div>
              <div className='w-full flex justify-center grey'>
                <button className='signup' onClick={(e) => signToggle(e)}>
                  {text('SIGN_UP')}
                </button>
              </div>
              <span className='switch bg-white shadow text-black flex items-center justify-center w-1/2 rounded-full h-10 transition-all top-[4px] absolute left-[4px]'>
                {isNewUser ? text('SIGN_UP') : text('SIGN_IN')}
              </span>
            </div>

            <ToastContainer />
          </div>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col w-full gap-4 mt-4 ease-in-out duration-200 delay-100'
          >
            {isNewUser ? (
              <SignUp
                nameChange={setName}
                emailChange={setEmail}
                passwordChange={setPassword}
                cpasswordChange={setCPassword}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
            ) : (
              <div className='appear-from-below'>
                <InputWithIcon
                  id='username'
                  placeholder={text('EMAIL')}
                  type='text'
                  icon='user'
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputWithIcon
                  id='spassword'
                  placeholder={text('PASSWORD')}
                  type='password'
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && (
                  <div className={'text-red-500 text-sm'}>{errorMessage.message}</div>
                )}
                <button
                  className='w-full p-4 rounded-lg bg-gradient-to-r from-brightBlue to-softBlue text-white text-lg'
                  type='submit'
                >
                  {text('SIGN_IN')}
                </button>
              </div>
            )}
            <div className='flex flex-col gap-4'>
              <div className='flex justify-center items-center grey'>
                <span className='w-1/4 h-[1px] bg-stone-950/[.2] mr-1'></span>
                {text('OR').toUpperCase()}
                <span className='w-1/4 h-[1px] bg-stone-950/[.2] ml-1'></span>
              </div>
              <button
                className='w-full flex p-4 rounded-lg bg-transparent hover:bg-slate-100 text-black text-lg items-center justify-center sm:gap-4 gap-1 border border-gray-300'
                onClick={(e) => handleGoogleSignIn(e)}
              >
                <img className='w-6 h-6' src='/icons/google.svg' alt='google' />
                {text('SIGN_IN_WITH_GOOGLE')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
