const APIKEY = process.env.NARAKEET_TTS_API_KEY,
  voice = 'Diljit';

import { Dispatch } from 'react';
import { createWriteStream } from 'fs';
import axios from 'axios';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { LocalUser } from 'auth/context';
import { storage } from './firebase';
import { updateWord } from 'utils';

export const getAudio = async (text: string) => {
  const response = await axios.post(
    `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
    text,
    {
      headers: {
        'accept': 'application/octet-stream',
        'x-api-key': APIKEY,
        'content-type': 'text/plain',
      },
      responseType: 'stream',
    },
  );

  response.data.pipe(createWriteStream('result.mp3'));

  return response.data;
};

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

const generateNarakeetAudio = async (text: string, fileRef: any) => {
  const response = await axios.post(
    `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
    text,
    {
      headers: {
        'accept': 'application/octet-stream',
        'x-api-key': APIKEY,
        'content-type': 'text/plain',
      },
      responseType: 'stream',
    },
  );

  response.data.pipe(createWriteStream('result.mp3'));

  // Upload the generated audio to Firebase Storage
  await uploadBytes(fileRef, response.data);

  // Get the download URL of the uploaded audio
  const audioURL = await getDownloadURL(fileRef);

  return audioURL;
};

export const generateAndUploadAudio = async (
  text: string,
  word_id: string,
  setLoading: Dispatch<boolean>,
) => {
  // Upload the image
  setLoading(true);

  // Generate audio using Narakeet
  const audioFileRef = ref(storage, `word_audios/${word_id}.mp3`);
  const narakeetAudioURL = await generateNarakeetAudio(text, audioFileRef);

  // Update user profile with the audio URL
  await updateWord(word_id, { audioURL: narakeetAudioURL });

  setLoading(false);
};
