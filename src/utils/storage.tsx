import { Dispatch } from 'react';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { User } from 'firebase/auth';

export const uploadImage = async (file: File, currentUser: User, setLoading: Dispatch<boolean>) => {
  const fileRef = ref(storage, `users/${currentUser.uid}/profile.${file.type.split('/')[1]}`);

  setLoading(true);
  await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  setLoading(false);
  return photoURL;
};
