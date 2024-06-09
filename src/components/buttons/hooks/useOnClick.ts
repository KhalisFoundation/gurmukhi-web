import ALL_CONSTANT from 'constants/constant';
import { ROUTES } from 'constants/routes';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { GameScreen, User } from 'types';
import Bugsnag from '@bugsnag/js';
import { bugsnagErrorHandler } from 'utils';
import { DefineWord, QuestionData, SentenceWord, WordType } from 'types';
import { NavigateFunction } from 'react-router-dom';
import { AppDispatch } from 'store/store';

const navigateTo = (
  navigate: NavigateFunction,
  key: string,
  wordID: string,
  data: DefineWord | SentenceWord | QuestionData | WordType,
  questionID: string | null = null,
) => {
  const routeMap = {
    [ALL_CONSTANT.DEFINITION]: `${ROUTES.WORD + ROUTES.DEFINITION}?id=${wordID}`,
    [ALL_CONSTANT.SENTENCES]: `${ROUTES.WORD + ROUTES.EXAMPLES}?id=${wordID}`,
    [ALL_CONSTANT.QUESTIONS_SMALL]: `${ROUTES.QUESTION}?id=${wordID}&qid=${questionID}`,
  };
  navigate(routeMap[key], { state: { data: data } });
};

const handleClick = async (
  coins: number,
  currentGamePosition: number,
  operation: string,
  currentLevel: number,
  gameArray: GameScreen[],
  navigate: NavigateFunction,
  user: User,
  dispatch: AppDispatch,
) => {
  const condition =
    coins !== 0
      ? currentLevel <= ALL_CONSTANT.LEVELS_COUNT && gameArray[currentGamePosition]
      : currentLevel < ALL_CONSTANT.LEVELS_COUNT && gameArray[currentGamePosition];
  if (gameArray.length === 0) {
    Bugsnag.notify(new Error('Game Array is empty'));
    return;
  }
  if (condition) {
    if (
      typeof currentGamePosition !== 'number' ||
      currentGamePosition < 0 ||
      currentGamePosition >= gameArray.length
    ) {
      return;
    }
    const session = gameArray[currentGamePosition];
    if (!session) {
      return;
    }
    const [key, wordID, questionID] = session.key.split('-');
    if (!key) {
      return;
    }
    const saveWordID = wordID;
    navigateTo(navigate, key, wordID, session.data, questionID);

    switch (operation) {
      case ALL_CONSTANT.BACK_TO_DASHBOARD:
        navigate(ROUTES.DASHBOARD);
        return;
      case ALL_CONSTANT.INFORMATION:
        navigate(`${ROUTES.WORD + ROUTES.INFORMATION}?id=${saveWordID}`);
        return;
      case ALL_CONSTANT.NEXT:
        if (currentGamePosition) {
          try {
            dispatch(setCurrentGamePosition(currentGamePosition));
          } catch (error) {
            bugsnagErrorHandler(error, 'handleClick in useOnClick.ts', { uid: user.uid }, user);
          }
        }
        break;
    }
  } else {
    navigate(`${ROUTES.WINCOIN}`);
  }
};

export default handleClick;
