import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Shabadavali from 'assets/icons/Shabadavali';
import { ROUTES } from 'constants/routes';
import { useAppSelector } from 'store/hooks';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from 'auth';

interface PropTypes {
  loggedIn?: boolean;
}

export default function Header({ ...props }: PropTypes) {
  const { t: text } = useTranslation();
  const { user } = useUserAuth();
  const [ photoURL, setPhotoURL ] = React.useState('/images/profile.jpeg');
  const navigate = useNavigate();
  const nanakCoin = useAppSelector((state) => state.nanakCoin);
  const loggedIn = props.loggedIn ?? false;
  const buttonComonStyle = 'block w-24 px-3 py-2 hover:bg-gray-200';

  useEffect(() => {
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  return (
    <header className='flex sticky inset-x-0 top-0 from-transparent items-center justify-between p-4 z-10 header-bg back-bg-image'>
      <a href={ROUTES.DASHBOARD}>
        <main className='flex items-center justify-between'>
          <Shabadavali />
          <h1 className='title'>{text('APP_TITLE')}</h1>
        </main>
      </a>
      <nav>
        {loggedIn ? (
          <ul className='flex items-center justify-between gap-4 brandon-grotesque dull-blue'>
            <li>
              <a href={ROUTES.DASHBOARD}>{text('DASHBOARD')}</a>
            </li>
            <li>
              <div
                className={
                  'flex bg-white h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1'
                }
              >
                <span className='text-[1.125rem] pl-2'>{nanakCoin}</span>
                <img src='/icons/coin.svg' className={'h-8 w-8'} />
              </div>
            </li>
            <li>
              <div className='group inline-block'>
                <button className='outline-none focus:outline-none px-3 py-1 flex items-center lg:min-w-32'>
                  <div
                    className={
                      'flex bg-white h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1'
                    }
                  >
                    <img src={photoURL} className={'h-8 w-8 rounded-full'} />
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
    </header>
  );
}
