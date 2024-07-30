import CONSTANTS from 'constants/index';

const firebaseErrorHandler = (code: string) => {
  const codeMessagesMap: { [key: string]: string } = {
    'auth/invalid-email': CONSTANTS.INVALID_EMAIL,
    'auth/user-disabled': CONSTANTS.USER_DISABLED,
    'auth/user-not-found': CONSTANTS.USER_NOT_FOUND,
    'auth/wrong-password': CONSTANTS.INCORRECT_PASSWORD,
    'auth/email-already-exists': CONSTANTS.EMAIL_ALREADY_EXISTS,
    'auth/internal-error': CONSTANTS.INTERNAL_ERROR,
    'auth/invalid-display-name': CONSTANTS.DISPLAY_NAME_INVALID,
    'auth/invalid-password': CONSTANTS.ERROR_PWD,
    'auth/too-many-requests': CONSTANTS.TOO_MANY_REQUESTS,
    'auth/operation-not-allowed': CONSTANTS.OPERATION_NOT_ALLOWED,
    'auth/weak-password': CONSTANTS.WEAK_PASSWORD,
  };
  return (
    codeMessagesMap[code] || codeMessagesMap[code] || 'An unexpected authentication error occurred'
  );
};

export default firebaseErrorHandler;
