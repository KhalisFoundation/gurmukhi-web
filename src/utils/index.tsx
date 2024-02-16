import { ToastPosition, toast } from 'react-toastify';
import { GameScreen } from 'types/shabadavalidb';

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
export const countQuestionKeys = (gameArray: GameScreen[]) => {
  let count = 0;
  gameArray.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (key.includes('Question')) {
        count++;
      }
    });
  });
  return count;
};


export * from './words';
