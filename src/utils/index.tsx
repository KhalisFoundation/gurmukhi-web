import { ToastPosition, toast } from 'react-toastify';

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

export * from './words';
