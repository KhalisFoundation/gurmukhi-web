import React, { useEffect, useState } from 'react';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import { useUserAuth } from 'auth';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { checkIfUsernameUnique, updateUserDocument } from 'database/shabadavalidb';
import { auth } from '../../firebase';
import { showToastMessage } from 'utils';
import { uploadImage } from 'utils/storage';
import CONSTANTS from 'constants/constant';
import { User } from 'types';
import { Timestamp } from 'firebase/firestore';

export default function Profile() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.PROFILE;
  const user = useUserAuth().user as User;

  const currentUser = user?.user || auth.currentUser || null;

  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.displayName);
  const [username, setUsername] = useState(user.username ?? user.email?.split('@')[0]);
  const [usernameError, setUsernameError] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [photoURL, setPhotoURL] = useState('/images/profile.jpeg');
  const [verifiable, setVerifiable] = useState(true);

  const formatDate = (date: string | Timestamp) => {
    if (!date) return 'not defined';
    return (typeof date === 'string' ? new Date(date) : date.toDate()).toLocaleString();
  };

  const formattedCreatedAt = formatDate(user.created_at);
  const formattedLastLoginAt = formatDate(user.lastLogInAt);

  const getTabData = (heading: string, info: string, children?: JSX.Element) => {
    return (
      <div className='flex'>
        <div className=''>
          <h3 className='text-lg font-bold pr-3'>{heading}</h3>
        </div>
        <div className={editMode ? 'col-span-4' : 'col-span-6'}>
          <h4 className='text-lg'>
            {info}
            {children}
          </h4>
        </div>
      </div>
    );
  };

  const handlePhotoChange = (e: any) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (photo && user) {
      uploadImage(photo, user, setIsLoading, setPhotoURL);
    }
  };

  const handleUsernameChange = async (e: any) => {
    setUsername(e.target.value);
    if (e.target.value === user.username) {
      setUsernameError('');
      return;
    }
    if (e.target.value.length < CONSTANTS.USERNAME_MIN_LENGTH) {
      setUsernameError(text('USERNAME_TOO_SHORT'));
      return;
    }
    if (e.target.value.length > CONSTANTS.USERNAME_MAX_LENGTH) {
      setUsernameError(text('USERNAME_TOO_LONG'));
      return;
    }
    const unique = await checkIfUsernameUnique(e.target.value);
    if (!unique) {
      setUsernameError(text('USERNAME_TAKEN'));
    } else {
      setUsernameError('');
    }
  };

  async function updateUserAndProfile(displayName: string) {
    const updatedUserData = {
      ...user,
      displayName,
      photoURL,
      username: username !== user.username ? username : user.username,
      user: null,
    };

    await updateUserDocument(user.uid, updatedUserData);

    if (currentUser) {
      await updateProfile(currentUser, { displayName, photoURL });
    }
  }

  const handleSubmit = async () => {
    if (user && usernameError === '') {
      // check if anything has changed
      const isUnchanged =
        name === user.displayName &&
        username === user.username &&
        photoURL === user.user?.photoURL &&
        photoURL === user.photoURL &&
        !photo;
      if (isUnchanged) {
        return;
      }
      try {
        setIsLoading(true);
        handleUpload();

        if (username !== user.username) {
          const isUnique = await checkIfUsernameUnique(username);
          if (!isUnique) {
            showToastMessage(text('USERNAME_TAKEN'), toast.POSITION.TOP_CENTER, false);
            return;
          }
        }

        await updateUserAndProfile(name);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          showToastMessage(error.message, toast.POSITION.TOP_CENTER, false, true);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      showToastMessage(text('FIX_ERRORS'), toast.POSITION.TOP_CENTER, false, true);
    }
  };

  const linkClass = 'flex flex-row items-center justify-between gap-2 min-w-26';
  const gridColSpan = editMode ? '6' : '8';

  const renderButton = (
    textValue: string,
    onClick: () => void,
    disabled: boolean,
    sides: boolean,
  ) => {
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
    return (
      <button
        onClick={onClick}
        className={linkClass}
        disabled={disabled}
        color='secondary'
        style={{
          fontFamily:
            "HvDTrial Brandon Grotesque, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
          letterSpacing: '.1rem',
        }}
      >
        {sides && (
          <FontAwesomeIcon
            icon={faDiamond}
            className='w-2 h-2 text-lightAzure border border-darkBlue rotate-45'
          />
        )}
        <p
          className={
            'bg-lightAzure text-darkBlue rounded-lg px-2 py-1 w-26 text-center border border-darkBlue' +
            disabledClass
          }
        >
          {textValue}
        </p>
        {sides && (
          <FontAwesomeIcon
            icon={faDiamond}
            className='w-2 h-2 text-lightAzure border border-darkBlue rotate-45'
          />
        )}
      </button>
    );
  };

  const renderLoader = () => {
    return (
      <span>
        <svg
          className='animate-spin h-5 w-5 m-auto'
          viewBox='0 0 24 24'
          style={{
            display: 'inline',
            marginInlineEnd: '0.5rem',
          }}
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='#1F4860'
            strokeWidth='2'
            fill='none'
            strokeDasharray='31.4 31.4'
          />
        </svg>
        <span>{text('LOADING')}</span>
      </span>
    );
  };

  useEffect(() => {
    const userDetails = user.user;

    if (userDetails?.photoURL) {
      setPhotoURL(userDetails.photoURL);
    }

    if (user?.uid) {
      setIsLoading(false);
      setName(user?.displayName || '');
      setUsername(user?.username || '');
      setVerifiable(!(user?.emailVerified || true));
    }
  }, [user.uid]);

  useEffect(() => {
    if (!photo) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  if (isLoading) {
    return renderLoader();
  }

  return (
    <section className='flex flex-row w-full h-full text-darkBlue '>
      <Meta title={title} description={description} />
      <div className='flex flex-col items-center m-auto brandon-grotesque'>
        <ToastContainer />
        <div className='flex flex-col justify-center items-center rounded-lg p-4 cardImage bg-cover bg-sky-100 bg-blend-soft-light aspect-auto md:w-full'>
          <h2 className='text-2xl font-bold'>{text('YOUR_DETAILS')}</h2>
          <div className='flex flex-col md:flex-row items-center justify-evenly gap-5 rounded-lg p-4 container'>
            <div className='flex flex-col items-center'>
              <img
                src={preview ?? photoURL}
                alt={'No Profile Picture found!'}
                className='h-64 w-64 rounded-full m-4'
              />
              {editMode ? (
                <div className='flex flex-row justify-center'>
                  <div className='w-64'>
                    <input type='file' accept='.png, .jpeg, .jpg' onChange={handlePhotoChange} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className=''>
              {getTabData(
                text('NAME'),
                '',
                editMode ? (
                  <div className='h-10 w-full'>
                    <input
                      className='h-full w-full rounded-lg border-2 border-darkBlue focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-transparent px-2'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                ) : (
                  <span>{name}</span>
                ),
              )}
              {getTabData(
                text('USERNAME'),
                '',
                editMode ? (
                  <div className='h-10 w-full'>
                    <input
                      className={
                        'h-full w-full rounded-lg border-2 focus:outline-none focus:ring-2 focus:border-transparent px-2' +
                        (usernameError
                          ? ' border-red-500 focus:ring-red-500'
                          : ' border-darkBlue focus:ring-darkBlue')
                      }
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </div>
                ) : (
                  <span>{username}</span>
                ),
              )}
              {editMode &&
                getTabData('', '', <span className='text-red-500'>{usernameError}</span>)}
              {user ? getTabData(text('EMAIL'), user.email) : null}
              {user?.emailVerified ?? false
                ? getTabData(text('EMAIL_VALIDATED'), text('YES'))
                : getTabData(
                  text('EMAIL_VALIDATED'),
                  '',
                  renderButton(
                    text('VERIFY'),
                    () => {
                      if (currentUser) {
                        sendEmailVerification(currentUser).then(() => {
                          showToastMessage(
                            text('EMAIL_VERIFICATION_SENT'),
                            toast.POSITION.TOP_CENTER,
                            true,
                          );
                          setVerifiable(false);
                        });
                      }
                    },
                    !verifiable,
                    false,
                  ),
                )}
              {getTabData(text('CREATED_AT'), formattedCreatedAt)}
              {getTabData(text('LAST_LOGIN_AT'), formattedLastLoginAt)}

              <div className={`col-span-${gridColSpan} py-2`}>
                <div className={`grid grid-cols-${gridColSpan} py-1`}>
                  <div className='col-span-2'>
                    {editMode
                      ? renderButton(
                        text('SAVE'),
                        () => {
                          setEditMode(!editMode);
                          handleSubmit();
                        },
                        false,
                        false,
                      )
                      : renderButton(
                        text('EDIT'),
                        () => {
                          setEditMode(!editMode);
                        },
                        false,
                        false,
                      )}
                  </div>
                </div>
              </div>

              {/* We can add preferences here like confetti disable and others */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
