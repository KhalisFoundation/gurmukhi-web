import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { GameScreen } from 'types/shabadavalidb';
import ALL_CONSTANT from 'constants/constant';
import { ROUTES } from 'constants/routes';
import { useNavigate } from 'react-router-dom';
import { updateCurrentProgress } from 'database/shabadavalidb';
import { useUserAuth } from 'auth';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';

const useOnClick = (currentGamePosition:number) => {
  const gameArray:GameScreen[] = useAppSelector(state=>state.gameArray);
  const currentLevel = useAppSelector(state=>state.currentLevel);
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const dispatch = useAppDispatch();

  const navigateTo = (
    key: string,
    wordID: string,
    data: any,
    questionID: string | null = null,
  ) => {
    const routeMap = {
      [ALL_CONSTANT.DEFINITION]: `${
        ROUTES.WORD + ROUTES.DEFINITION
      }?id=${wordID}`,
      [ALL_CONSTANT.SENTENCES]: `${
        ROUTES.WORD + ROUTES.EXAMPLES
      }?id=${wordID}`,
      [ALL_CONSTANT.QUESTIONS_SMALL]: `${ROUTES.QUESTION}?id=${wordID}&qid=${questionID}`,
    };
    navigate(routeMap[key], { state: { data: data } });
  };

  const handleClick = useCallback((operation:string) => {
    if (currentLevel < ALL_CONSTANT.LEVELS_COUNT - 1) {
      if (gameArray.length === 0) {
        return;
      }
      let saveWordID = null;
      const sessionInfo = currentGamePosition !== undefined ? gameArray[currentGamePosition] : null;

      if (sessionInfo) {
        const [key, wordID, questionID] = sessionInfo.key.split('-');
        saveWordID = wordID;
        if (key) {
          navigateTo(key, wordID, sessionInfo.data, questionID);
        }
      }
      switch (operation) {
        case ALL_CONSTANT.BACK_TO_DASHBOARD:
          navigate(ROUTES.DASHBOARD);
          return;
        case ALL_CONSTANT.INFORMATION:
          navigate(`${ROUTES.WORD + ROUTES.INFORMATION}?id=${saveWordID}`);
          return;
        case ALL_CONSTANT.NEXT:
          if (currentGamePosition) {
            updateCurrentProgress(user.uid, currentGamePosition);
            dispatch(setCurrentGamePosition(currentGamePosition));
          }
          break;
      }
      
    } else {
      navigate(`${ROUTES.WINCOIN}`);
    }
  }, [gameArray, currentGamePosition]);

  return handleClick;

};
export default useOnClick;
