import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { useUserAuth } from 'auth';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { checkIfUsernameUnique, showToastMessage, updateUser } from 'utils';
import { ToastContainer, toast } from 'react-toastify';
import { uploadImage } from 'utils/storage';
import { doc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.PROFILE;
  const { user } = useUserAuth();

  const [ isLoading, setIsLoading ] = useState(true);
  const [ editMode, setEditMode ] = useState(false);
  const [ name, setName ] = useState(user.displayName);
  const [ username, setUsername ] = useState(user.username ?? user.email?.split('@')[0]);
  const [ usernameError, setUsernameError ] = useState('');
  const [ photo, setPhoto ] = useState<File | null>(null);
  const [ preview, setPreview ] = useState<string | undefined>(undefined);
  const [ photoURL, setPhotoURL ] = useState('/images/profile.jpeg');
  const [ verifiable, setVerifiable ] = useState(true);

  const createdAt = new Date(user.createdAt);
  const lastLoginAt = new Date(user.lastLogInAt);

  const getTabData = (heading: string, info: string, children?: JSX.Element) => {
    const gridColSpan = editMode ? 'grid-cols-6' : 'grid-cols-8';
    return (
      <div className={editMode ? 'col-span-6' : 'col-span-8'}>
        <div className={`grid ${gridColSpan} py-1`}>
          <div className='col-span-2'>
            <h3 className='text-lg font-bold pr-3'>
              {heading}
            </h3>
          </div>
          <div className={editMode ? 'col-span-4' : 'col-span-6'}>
            <h4 className='text-lg'>
              {info}
              {children}
            </h4>
          </div>
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
    if (e.target.value.length < 3) {
      setUsernameError(text('USERNAME_TOO_SHORT'));
      return;
    }
    if (e.target.value.length > 20) {
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

  const handleSubmit = async () => {
    if (user && usernameError === '') {
      // check if anything has changed
      if (name === user.displayName && username === user.username && photoURL === user.user.photoURL && !photo) {
        return;
      }
      try {
        setIsLoading(true);
        handleUpload();
        const userRef = doc(firestore, `users/${user.uid}`);
        if (username !== user.username) {
          const unique = checkIfUsernameUnique(username);
          if (!unique) {
            showToastMessage(text('USERNAME_TAKEN'), toast.POSITION.TOP_CENTER, false);
            return;
          } else {
            await updateUser(userRef, { ...user, displayName: name, photoURL, username, user: null });
            await updateProfile(
              user.user,
              {
                displayName: name,
                photoURL,
              },
            );
            
            showToastMessage(text('PROFILE_UPDATED'), toast.POSITION.TOP_CENTER, true);
          }
        } else {
          await updateUser(userRef, { ...user, displayName: name, photoURL, user: null });
          await updateProfile(
            user.user,
            {
              displayName: name,
              photoURL,
            },
          );
          
          showToastMessage(text('PROFILE_UPDATED'), toast.POSITION.TOP_CENTER, true);
        }
      } catch (error: any) {
        console.error(error);
        showToastMessage(error.message, toast.POSITION.TOP_CENTER, false, true);
      } finally {
        setIsLoading(false);
      }
    } else {
      showToastMessage(text('FIX_ERRORS'), toast.POSITION.TOP_CENTER, false, true);
    }
  };

  const linkClass = 'flex flex-row items-center justify-between gap-2 min-w-26';
  const gridColSpan = editMode ? '6' : '8';

  const renderButton = (textValue: string, onClick: () => void, disabled: boolean, sides: boolean) => {
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
        {sides && <FontAwesomeIcon icon={faDiamond} className='w-2 h-2 text-lightAzure border border-darkBlue rotate-45' />}
        <p className={'bg-lightAzure text-darkBlue rounded-lg px-2 py-1 w-26 text-center border border-darkBlue' + disabledClass}>
          {textValue}
        </p>
        {sides && <FontAwesomeIcon icon={faDiamond} className='w-2 h-2 text-lightAzure border border-darkBlue rotate-45' />}
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
    if (user.user?.photoURL) {
      setPhotoURL(user.user.photoURL);
    }
    if (user?.uid) {
      setIsLoading(false);
      setName(user.displayName);
      setUsername(user.username);
      setVerifiable(!user.emailVerified);
    }
  }, [user]);

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
    <section className='flex flex-row w-full h-full gap-5 p-12 text-darkBlue pt-28'>
      <Meta title={title} description={description} />
      <div className='flex flex-col w-full items-center gap-5 brandon-grotesque'>
        <ToastContainer />
        <div className='flex flex-col justify-center items-center rounded-lg p-4 cardImage bg-cover bg-sky-100 bg-blend-soft-light aspect-auto'>
          <h2 className='text-2xl font-bold'>{text('YOUR_DETAILS')}</h2>
          <div className='flex flex-row items-center justify-between gap-5 rounded-lg p-4 container'>
            <div className='flex flex-col items-center'>
              <img src={preview ?? photoURL} alt={'No Profile Picture found!'} className='h-60 w-60 rounded-full m-4' />
              {editMode ? 
                <div className='flex flex-row justify-center'>
                  <div className='w-[200px]'>
                    <input
                      type='file'
                      accept='.png, .jpeg, .jpg'
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>
                : null
              }
            </div>
            <div className={`grid grid-cols-${gridColSpan}`}>
              <div className={`col-span-${gridColSpan} py-2`}>
              </div>
              {getTabData(text('NAME'), '', (
                editMode ?
                  <div className='h-10 w-full'>
                    <input
                      className='h-full w-full rounded-lg border-2 border-darkBlue focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-transparent px-2'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  : <span>{name}</span>
              ))}
              {getTabData(text('USERNAME'), '', (
                editMode ?
                  <div className='h-10 w-full'>
                    <input
                      className={
                        'h-full w-full rounded-lg border-2 focus:outline-none focus:ring-2 focus:border-transparent px-2'
                        + (usernameError ? ' border-red-500 focus:ring-red-500' : ' border-darkBlue focus:ring-darkBlue')
                      }
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </div>
                  : <span>{username}</span>
              ))}
              {editMode && getTabData('', '', (
                <span className='text-red-500'>{usernameError}</span>
              ))}
              {getTabData(text('EMAIL'), user.email)}
              {
                user?.emailVerified ?? false
                  ? getTabData(text('EMAIL_VALIDATED'), text('YES'))
                  : getTabData(text('EMAIL_VALIDATED'), '', (
                    renderButton(text('VERIFY'), () => sendEmailVerification(auth.currentUser ?? user).then(() => {
                      showToastMessage(text('EMAIL_VERIFICATION_SENT'), toast.POSITION.TOP_CENTER, true);
                      setVerifiable(false);
                    }), !verifiable, false)
                  ))
              }
              {getTabData(text('CREATED_AT'), createdAt.toLocaleString() ?? 'not defined')}
              {getTabData(text('LAST_LOGIN_AT'), lastLoginAt.toLocaleString() ?? 'not defined')}

              <div className={`col-span-${gridColSpan} py-2`}>
                <div className={`grid grid-cols-${gridColSpan} py-1`}>
                  <div className='col-span-2'>
                    {editMode ?
                      renderButton(
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
                      )
                    }
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
