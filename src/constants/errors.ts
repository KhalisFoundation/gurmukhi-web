export interface StringyObject {
  [key: string]: string;
}

export const firebaseErrorCodes: StringyObject = {
  'auth/user-not-found': 'No user found with this email id.',
  'auth/email-already-in-use': 'The email address is already in use.',
  'auth/invalid-email': 'The email address is invalid.',
  'auth/operation-not-allowed': 'The email/password accounts are not enabled.',
  'auth/weak-password': 'The password is too weak.',
  'auth/wrong-password': 'The password is incorrect.',
};
