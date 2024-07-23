import React, { useEffect, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { checkIfUsernameUnique, updateUserDocument } from 'database/shabadavalidb';
import { auth } from '../../firebase';
import { showToastMessage } from 'utils';
import { uploadImage } from 'utils/storage';
import CONSTANTS from 'constants/constant';
import { User } from 'types';
import { Timestamp } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import renderButton from './components/RenderButton';
import getTabData from './components/GetTabData';
import Loading from 'components/loading';
import { updateUserData } from 'store/features/userDataSlice';

export default function Profile() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.PROFILE;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userData) as User;
  const authUser = auth.currentUser;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.displayName);
  const [username, setUsername] = useState<string>(user.username ?? user.email?.split('@')[0]);
  const [usernameError, setUsernameError] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [photoURL, setPhotoURL] = useState<string>(user.photoURL || '/images/profile.jpeg');

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    if (!photo) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);
    setPhotoURL(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const formatDate = (date: string | Timestamp) => {
    if (!date) return 'not defined';

    // Check if 'date' is an instance of Timestamp
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleString();
    } else if (typeof date === 'string') {
      // It's a string, so convert it to Date
      return new Date(date).toLocaleString();
    } else {
      // Log an error if the date is neither a Timestamp nor a string
      return 'Invalid date';
    }
  };

  const formattedCreatedAt = user.created_at ? formatDate(user.created_at) : '';
  const formattedLastLoginAt = user.lastLogInAt ? formatDate(user.lastLogInAt) : '';

  const handlePhotoChange = (e: any) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (photo && authUser) {
      const imageURL = await uploadImage(photo, authUser, setIsLoading);
      setPhotoURL(imageURL);
      return imageURL;
    }
    return '';
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

  async function updateUserAndProfile(data: { name: string; photoURL: string }) {
    const updatedUserData = {
      displayName: data.name !== '' ? data.name : user.displayName,
      photoURL: data.photoURL !== '' ? data.photoURL : user.photoURL,
      username: username !== user.username ? username : user.username,
      user: null,
    };

    await updateUserDocument(user.uid, updatedUserData);
    dispatch(updateUserData({ ...updatedUserData }));

    if (authUser) {
      await updateProfile(authUser, {
        photoURL: updatedUserData.photoURL,
        displayName: updatedUserData.displayName,
      });
    }
  }

  const handleSubmit = async () => {
    if (user && usernameError === '') {
      // check if anything has changed
      const isUnchanged =
        name === user.displayName &&
        username === user.username &&
        photoURL === user.photoURL &&
        !photo;
      if (isUnchanged) {
        return;
      }
      try {
        const data = {
          photoURL: '',
          name: '',
        };
        setIsLoading(true);

        if (photoURL !== user.photoURL) {
          const imageURL = await handleUpload();
          data.photoURL = imageURL;
        }

        if (name !== user.displayName) {
          data.name = name;
        }

        if (username !== user.username) {
          const isUnique = await checkIfUsernameUnique(username);
          if (!isUnique) {
            showToastMessage(text('USERNAME_TAKEN'), toast.POSITION.TOP_CENTER, false);
            return;
          }
        }

        await updateUserAndProfile(data);
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

  const gridColSpan = editMode ? '6' : '8';

  const buttonSelector = () => {
    if (editMode) {
      return renderButton(
        text('SAVE'),
        () => {
          setEditMode(!editMode);
          handleSubmit();
        },
        false,
        false,
      );
    }
    return renderButton(
      text('EDIT'),
      () => {
        setEditMode(!editMode);
      },
      false,
      false,
    );
  };

  if (isLoading) {
    return <Loading />;
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
                editMode,
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
                editMode,
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
                getTabData('', '', editMode, <span className='text-red-500'>{usernameError}</span>)}
              {user ? getTabData(text('EMAIL'), user.email, editMode) : null}
              {getTabData(text('CREATED_AT'), formattedCreatedAt, editMode)}
              {getTabData(text('LAST_LOGIN_AT'), formattedLastLoginAt, editMode)}

              <div className={`col-span-${gridColSpan} py-2`}>
                <div className={`grid grid-cols-${gridColSpan} py-1`}>
                  <div className='col-span-2'>{buttonSelector()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
