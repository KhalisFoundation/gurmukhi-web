const APIKEY = process.env.NARAKEET_TTS_API_KEY,
  voice = 'Diljit',
  text = 'Hi there from the API';

import { Dispatch } from 'react';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
// import got from 'got';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { LocalUser } from 'auth/context';
import { storage, wordsdb } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateWord } from 'utils';

// export const getAudio = async (text: string) => {
//     const data = await pipeline(
//         Readable.from([text]),
//         got.stream.post(
//             `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
//             {
//                 headers: {
//                     'accept': 'application/octet-stream',
//                     'x-api-key': APIKEY,
//                     'content-type': 'text/plain'
//                 },
//                 body: text
//             }
//         )
//         createWriteStream('result.mp3')
//     )

//     return data;
// };

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

// export const generateAndUploadAudio = async (
//   text: string,
//   word_id: string,
//   setLoading: Dispatch<boolean>,
// ) => {
//   // Upload the image
//   setLoading(true);

//   // Generate audio using Narakeet
//   const audioFileRef = ref(storage, `word_audios/${word_id}.mp3`);
//   const narakeetAudioURL = await generateNarakeetAudio(text, audioFileRef);

//   // Update user profile with the audio URL
//   await updateWord(word_id, { audioURL: narakeetAudioURL });

//   setLoading(false);
// };

// const generateNarakeetAudio = async (text: string, fileRef: any) => {
//   await pipeline(
//     Readable.from([text]),
//     got.stream.post(
//       `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
//       {
//         headers: {
//           'accept': 'application/octet-stream',
//           'x-api-key': APIKEY,
//           'content-type': 'text/plain'
//         }
//       },
//     ),
//     createWriteStream('tempAudio.mp3')
//   );

//   // get audio file from name and pass it to uploadBytes
//   // Upload the generated audio to Firebase Storage
//   await uploadBytes(fileRef, './tempAudio.mp3');

//   // Get the download URL of the uploaded audio
//   return getDownloadURL(fileRef);
// };
