import Bugsnag from '@bugsnag/js';
import { ToastPosition, toast } from 'react-toastify';
import { User } from 'types/shabadavalidb';

interface MetaData {
  [key: string]: any;
}

export const showToastMessage = (
  message: string,
  position: ToastPosition,
  closeOnClick: boolean,
  error?: boolean,
) => {
  if (error) {
    toast.error(message, {
      position: position,
      closeOnClick,
    });
    return;
  }
  toast.success(message, {
    position: position,
    closeOnClick,
  });
};

export const bugsnagErrorHandler = (
  userID: string,
  error: any,
  dataType?: string,
  metaData?: MetaData,
  user?: User,
) => {
  let errorMessage = '';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = error?.toString() ?? 'Unknown error';
  }
  if (typeof Bugsnag === 'undefined') {
    console.warn('Bugsnag is not initialized');
    return;
  }
  if (process.env.NODE_ENV === 'development') {
    console.error(errorMessage);
  }

  Bugsnag.notify(new Error(errorMessage), function (event) {
    event.severity = 'error';
    event.setUser(userID, user?.email, user?.displayName);
    if (dataType && metaData && Object.keys(metaData).length > 0) {
      event.addMetadata(dataType, metaData);
    }
  });
};

export * from './words';
