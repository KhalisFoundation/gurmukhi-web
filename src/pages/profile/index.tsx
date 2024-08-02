import React, { useEffect, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { updateUserDocument } from 'database/shabadavalidb';
import { auth } from '../../firebase';
import { showToastMessage } from 'utils';
import { uploadImage } from 'utils/storage';
import { User } from 'types';
import { Timestamp } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import RenderButton from './components/RenderButton';
import TabData from './components/TabData';
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
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [photoURL, setPhotoURL] = useState<string>(user.photoURL || '/images/profile.jpeg');

  useEffect(() => {
    if (user.uid) {
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

  const formatDate = (date: Timestamp) => {
    if (!date) return 'not defined';
    const timestamp = new Timestamp(date.seconds, date.nanoseconds);
    return timestamp.toDate().toLocaleString();
  };

  const formattedCreatedAt = formatDate(user.created_at);
  const formattedLastLoginAt = formatDate(user.lastLogInAt);

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

  async function updateUserAndProfile(data: { name: string; photoURL: string }) {
    const updatedUserData = {
      displayName: data.name !== '' ? data.name : user.displayName,
      photoURL: data.photoURL !== '' ? data.photoURL : user.photoURL,
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
    if (user) {
      // check if anything has changed
      const isUnchanged =
        name === user.displayName &&
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
              <TabData heading={text('NAME')} info={''} editMode>
                {editMode ? (
                  <div className='h-10 w-full'>
                    <input
                      className='h-full w-full rounded-lg border-2 border-darkBlue focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-transparent px-2'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                ) : (
                  <span>{name}</span>
                )}
              </TabData>
              {user.email && <TabData heading={text('EMAIL')} info={user.email} editMode={false} />}
              <TabData heading={text('CREATED_AT')} info={formattedCreatedAt} editMode />
              <TabData heading={text('LAST_LOGIN_AT')} info={formattedLastLoginAt} editMode />
              <div className={`col-span-${gridColSpan} py-2`}>
                <div className={`grid grid-cols-${gridColSpan} py-1`}>
                  <div className='col-span-2'>
                    <RenderButton
                      text={editMode ? text('SAVE') : text('EDIT')}
                      onClick={editMode
                        ? () => {
                          setEditMode(!editMode);
                          handleSubmit();
                        }
                        : () => {
                          setEditMode(!editMode);
                        }
                      }
                      disabled={false}
                      sides={false}
                    />
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
