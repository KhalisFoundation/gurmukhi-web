import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import handleClick from './hooks/useOnClick';
import LoaderButton from './LoaderButton';
import ALL_CONSTANT from 'constants/constant';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from 'auth';
import { GameScreen } from 'types/shabadavalidb';

interface Props {
  operation: string;
  text?: string;
  active?: boolean;
  currentGamePosition: number;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const StartQuestionBtn = ({
  operation,
  text,
  active = true,
  currentGamePosition,
  isDisabled,
  isLoading = false,
}: Props) => {
  const isActive = active ? '' : ' disabled';
  const linkClass = `flex flex-row items-center justify-between gap-2 min-w-52 ${isActive} ${
    isDisabled ? 'cursor-not-allowed' : ''
  }`;
  const { 
    gameSession: gameArray,
    currentLevel,
  } = useAppSelector((state) => state.progress);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useUserAuth();

  return (
    <button
      onClick={() =>
        handleClick(
          currentGamePosition,
          operation,
          currentLevel,
          gameArray as GameScreen[],
          navigate,
          user,
          dispatch,
        )
      }
      className={linkClass}
      disabled={isDisabled}
      style={{
        fontFamily:
          "HvDTrial Brandon Grotesque, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
        letterSpacing: '.1rem',
      }}
    >
      <FontAwesomeIcon icon={faDiamond} className='w-2 h-2 text-lightAzure' />
      <p className='bg-lightAzure text-darkBlue rounded-lg p-3 w-52 text-center'>
        {isLoading ? <LoaderButton theme={ALL_CONSTANT.DARK} /> : text?.toUpperCase()}
      </p>
      <FontAwesomeIcon icon={faDiamond} className='w-2 h-2 text-lightAzure' />
    </button>
  );
};

export default StartQuestionBtn;
