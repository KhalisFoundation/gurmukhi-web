import { LocalUser } from 'auth/context';
import { storage } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Dispatch } from 'react';

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
