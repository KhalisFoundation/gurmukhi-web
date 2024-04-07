import Bugsnag from '@bugsnag/js';
import { ToastPosition, toast } from 'react-toastify';
import { User } from 'types/shabadavalidb';

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
  errorMessage: string,
  userId: string,
  datatype: string,
  itemId: string,
  item: any,
  user?: User,
) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(errorMessage);
  }
  Bugsnag.notify(new Error(errorMessage), function (event) {
    event.severity = 'error';
    event.setUser(userId, user?.email, user?.displayName);
    event.addMetadata(datatype, { id: itemId, ...item });
  });
};

export * from './words';
