import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ROUTES } from 'constants/routes';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import ALL_CONSTANT from 'constants/constant';

interface Props {
  operation?: string;
  text?: string;
  active?: boolean;
  currentGamePosition?: number;
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isActive = active ? '' : ' disabled';
  const linkClass =
    'flex flex-row items-center justify-between gap-2 min-w-52 ' + isActive;
  const gameArray = useAppSelector((state) => state.gameArray);
  const currentLevel = useAppSelector((state) => state.currentLevel);

  const navigateTo = (
    key: string,
    wordID: string,
    questionID: string | null = null,
  ) => {
    const routeMap = {
      [ALL_CONSTANT.DEFINITION]: `${
        ROUTES.WORD + ROUTES.DEFINITION
      }?id=${wordID}`,
      [ALL_CONSTANT.SENTENCES]: `${ROUTES.WORD + ROUTES.EXAMPLES}?id=${wordID}`,
      [ALL_CONSTANT.QUESTIONS_SMALL]: `${ROUTES.QUESTION}?id=${wordID}&qid=${questionID}`,
    };
    navigate(routeMap[key]);
  };
  const handleClick = useCallback(() => {
    if (currentLevel < ALL_CONSTANT.LEVELS_COUNT - 1) {
      if (gameArray.length > 0) {
        const sessionInfo =
          currentGamePosition !== undefined
            ? gameArray[currentGamePosition]
            : null;
        console.log('sessionInfo', sessionInfo);
        console.log(currentGamePosition);
        if (sessionInfo) {
          const [key, wordID, questionID] = sessionInfo.split('-');
          console.log('Question ID', questionID);
          if (key) {
            navigateTo(key, wordID, questionID);
          }
        }
        switch (operation) {
          case ALL_CONSTANT.BACK_TO_DASHBOARD:
            navigate(ROUTES.DASHBOARD);
            return;
          case ALL_CONSTANT.NEXT:
            if (currentGamePosition) {
              dispatch(setCurrentGamePosition(currentGamePosition));
            }
            break;
        }
      }
    } else {
      navigate(`${ROUTES.WINCOIN}`);
    }
  }, [gameArray, currentGamePosition]);
  const renderLoader = () => {
    // please keep one of the below loaders
    return (
      <span>
        <svg 
          className='animate-spin h-5 w-5 m-auto'
          viewBox='0 0 24 24'
          style={{
            display: 'inline',
            marginInlineEnd: '0.5rem',
          }}
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='#1F4860'
            strokeWidth='2'
            fill='none'
            strokeDasharray='31.4 31.4'
          />
        </svg>
        <span>{ALL_CONSTANT.FETCHING}</span>
        <div className='loader'></div>
      </span>
    );
  };
  return (
    <button
      onClick={handleClick}
      className={linkClass}
      disabled={isDisabled}
      color='secondary'
      style={{
        fontFamily:
          "HvDTrial Brandon Grotesque, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
        letterSpacing: '.1rem',
      }}
    >
      <FontAwesomeIcon icon={faDiamond} className='w-2 h-2 text-lightAzure' />
      <p className='bg-lightAzure text-darkBlue rounded-lg p-3 w-52 text-center'>
        {isLoading ? renderLoader() : text?.toUpperCase()}
      </p>
      <FontAwesomeIcon icon={faDiamond} className='w-2 h-2 text-lightAzure' />
    </button>
  );
};

export default StartQuestionBtn;
