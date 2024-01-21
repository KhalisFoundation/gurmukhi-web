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
  const [ photoURL, setPhotoURL ] = useState('/images/profile.jpeg');
  const [ verifiable, setVerifiable ] = useState(true);

  const createdAt = new Date(user.createdAt);
  const lastLoginAt = new Date(user.lastLogInAt);

  const getTabData = (heading: string, info: string, children?: JSX.Element) => {
    return (
      <div className='col-span-12'>
        <div className='grid grid-cols-12 py-1'>
          <div className='col-span-2'>
            <h3 className='text-lg font-bold pr-3'>
              {heading}
            </h3>
          </div>
          <div className='col-span-8'>
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
      if (name === user.displayName && username === user.username && photoURL === user.user.photoURL) {
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

  const buttonStyle = 'group relative h-8 overflow-hidden rounded-lg text-md shadow';
  const buttonInnerDivStyle = 'absolute inset-0 w-3 bg-darkBlue transition-all duration-[250ms] ease-out group-hover:w-full';

  const renderLoader = () => {
    // please keep one of the below loaders
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

  if (isLoading) {
    return renderLoader();
  }

  return (
    <section className='flex flex-row w-full h-full justify-between gap-5 p-12'>
      <Meta title={title} description={description} />
      <div className='flex flex-col items-left gap-5 brandon-grotesque'>
        <ToastContainer />
        <div className='col-span-9 general-info'>
          <div className='tab-content' id='myTabContent'>
            <div className='tab-pane fade show active' id='about' role='tabpanel' aria-labelledby='about-tab'>
              <div className='box-component'>
                <h2 className='text-2xl font-bold'>{text('YOUR_DETAILS')}</h2>
                <div className='container'>
                  <div className='grid grid-cols-12'>
                    <div className='col-span-12 py-2'>
                      <img src={photoURL} alt={'No Profile Picture found!'} className='w-32 h-32 rounded-full m-4' />
                      {editMode ? 
                        <div className='grid grid-cols-12 py-1'>
                          <div className='col-span-8'>
                            <input
                              type='file'
                              accept='.png, .jpeg, .jpg'
                              onChange={handlePhotoChange}
                            />
                          </div>
                          <div className='col-span-4'>
                            <button
                              className={buttonStyle + ' px-4'  + (photo ? ' bg-white' : ' bg-gray-300')}
                              disabled={isLoading || !photo}
                              onClick={handleUpload}
                            >
                              {
                                !photo
                                  ? null
                                  : <div className={buttonInnerDivStyle}></div>
                              }
                              <span className={'relative text-black'  + (photo ? ' group-hover:text-white' : '')}>{text('UPLOAD_A_PHOTO')}</span>
                            </button>
                          </div>
                        </div>
                        : null
                      }
                    </div>
                    {getTabData(text('NAME'), '', (
                      editMode ?
                        <div className='relative h-10 w-full min-w-[200px]'>
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
                        <div className='relative h-10 w-full min-w-[200px]'>
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
                          <button
                            className={buttonStyle + ' w-24' + (verifiable ? ' bg-white' : ' bg-gray-300')}
                            onClick={() => sendEmailVerification(auth.currentUser ?? user).then(() => {
                              showToastMessage(text('EMAIL_VERIFICATION_SENT'), toast.POSITION.TOP_CENTER, true);
                              setVerifiable(false);
                            })}
                            disabled={!verifiable}
                          >
                            {verifiable ?
                              <div className={buttonInnerDivStyle}></div> :
                              null
                            }
                            <span className={'relative text-black' + (verifiable ? ' group-hover:text-white' : '')}>{text('VERIFY')}</span>
                          </button>
                        ))
                    }
                    {getTabData(text('CREATED_AT'), createdAt.toLocaleString() ?? 'not defined')}
                    {getTabData(text('LAST_LOGIN_AT'), lastLoginAt.toLocaleString() ?? 'not defined')}

                    <div className='col-span-12 py-2'>
                      <div className='grid grid-cols-12 py-1 align-left'>
                        <div className='col-span-2'>
                          <button
                            className={buttonStyle + ' w-24 bg-white'}
                            onClick={() => {
                              setEditMode(!editMode);
                              if (editMode) {
                                handleSubmit();
                              }
                            }}
                            disabled={!verifiable}
                          >
                            <div className={buttonInnerDivStyle}></div>
                            <span className={'relative text-black group-hover:text-white'}>
                              {editMode ? text('SAVE') : text('EDIT')}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* We can add preferences here like confetti disable and others */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
