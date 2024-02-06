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

export const generateNarakeetAudio = async (text: string, type: string, setAudioUrl: Dispatch<string>, id?: string) => {
  try {
    const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
    const requestUrl = `${BACKEND_API_URL}generate-audio`;
    const reqJson = {
      id: id ?? undefined,
      type: type,
      voice: 'Diljit',
      text: text,
    };
    console.log('reqJson:', reqJson);
    const response = await axios.post(
      requestUrl,
      reqJson,
    );
    console.log('response:', response);

    setAudioUrl(response.data.audio);
    return response;
  } catch (error) {
    console.error('Error generating audio:', error);
    // Handle errors here
  }
};
