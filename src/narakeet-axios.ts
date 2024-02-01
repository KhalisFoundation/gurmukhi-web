import { Dispatch } from 'react';
import axios from 'axios';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { LocalUser } from 'auth/context';
import { storage } from './firebase';

export const uploadImage = async (
  file: File,
  currentUser: LocalUser,
  setLoading: Dispatch<boolean>,
  setPhotoURL: Dispatch<string>,
) => {
  const fileRef = ref(storage, `users/${currentUser.uid}/profile.${file.type.split('/')[1]}`);
      
  setLoading(true);
  await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  
  if (currentUser.user) {
    updateProfile(currentUser.user, { photoURL });
    setPhotoURL(photoURL);
  }
  setLoading(false);
};

export const generateNarakeetAudio = async (text: string, setAudioUrl: Dispatch<string>) => {
  try {
    const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080/';
    const requestUrl = `${BACKEND_API_URL}generate-audio`;
    const response = await axios.post(
      requestUrl,
      {
        voice: 'Diljit',
        text: text,
      },
    );

    setAudioUrl(`data:audio/mp3;base64,${response.data.audio.toString('base64')}`);
    return response;
  } catch (error) {
    console.error('Error generating audio:', error);
    // Handle errors here
  }
};
