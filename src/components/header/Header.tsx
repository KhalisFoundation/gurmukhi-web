import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import BackBtn from 'components/buttons/BackBtn';
import EndSessionButton from 'components/buttons/EndSessionBtn';
import Shabadavali from 'assets/icons/Shabadavali';
import { ROUTES } from 'constants/routes';
import { useAppSelector } from 'store/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from 'auth';
import { User } from 'types';

interface PropTypes {
  loggedIn?: boolean;
}

export default function Header({ ...props }: PropTypes) {
  const { t: text } = useTranslation();
  const user = useUserAuth().user as User;
  const [photoURL, setPhotoURL] = useState('/images/profile.jpeg');
  const location = useLocation();
  const navigate = useNavigate();
  const nanakCoin: number = useAppSelector((state) => state.nanakCoin);
  const loggedIn = props.loggedIn ?? false;
  const buttonComonStyle = 'block w-24 px-3 py-2 hover:bg-gray-200';

  useEffect(() => {
    const photo = user?.user?.photoURL || user?.photoURL;
    if (photo) {
      setPhotoURL(photo);
    }
  }, [user?.photoURL, user?.user?.photoURL, user?.user]);

  return (
    <header className='flex flex-col sticky inset-x-0 top-0 from-transparent z-10 bg-[#bfdbea] lg:bg-transparent'>
      <div className='flex justify-between p-4'>
        <a href={ROUTES.DASHBOARD}>
          <main className='flex items-center justify-between'>
            <Shabadavali />
            <h1 className='title text-xl md:text-2xl'>{text('APP_TITLE')}</h1>
          </main>
        </a>
        <nav>
          {loggedIn ? (
            <ul className='flex items-center justify-between md:gap-4 brandon-grotesque dull-blue'>
              <li className='hidden md:block'>
                <a href={ROUTES.DASHBOARD}>{text('DASHBOARD')}</a>
              </li>
              <li>
                <div
                  className={
                    'flex bg-white h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 sm:p-1'
                  }
                >
                  <span className='text-[1.125rem] pl-2'>{nanakCoin}</span>
                  <img src='/icons/coin.svg' className={'h-8 w-8'} alt='coin' />
                </div>
              </li>
              <li>
                <div className='group inline-block'>
                  <button className='outline-none focus:outline-none px-1 sm:px-3 py-1 flex items-center lg:min-w-32'>
                    <div
                      className={
                        'flex bg-white h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1'
                      }
                    >
                      <img src={photoURL} className={'h-8 w-8 rounded-full'} alt='profile picture' />
                    </div>
                    <span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className='w-3 h-3 fill-current transform group-hover:-rotate-180 transition duration-150 ease-in-out'
                      />
                    </span>
                  </button>
                  <ul className='bg-white border rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-24 right-8'>
                    <li>
                      <button
                        onClick={() => {
                          navigate(ROUTES.PROFILE);
                        }}
                        className={buttonComonStyle}
                      >
                        {text('PROFILE')}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          navigate(ROUTES.LOG_OUT);
                        }}
                        className={buttonComonStyle}
                      >
                        {text('SIGN_OUT')}
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          ) : null}
        </nav>
      </div>
      {(location.pathname.includes(ROUTES.WORD) || location.pathname === ROUTES.QUESTION) && (
        <div className=' flex-row flex justify-between mx-3'>
          {location.pathname !== ROUTES.QUESTION && <BackBtn navlink={-1} />}
          <EndSessionButton className='ml-auto' />
        </div>
      )}
    </header>
  );
}
