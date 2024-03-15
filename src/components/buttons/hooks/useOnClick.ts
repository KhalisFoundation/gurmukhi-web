import { GameScreen } from 'types/shabadavalidb';
import ALL_CONSTANT from 'constants/constant';
import { ROUTES } from 'constants/routes';
import { getNanakCoin, updateCurrentProgress } from 'database/shabadavalidb';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { User } from 'types/shabadavalidb';

const navigateTo = (
  navigate: any,
  key: string,
  wordID: string,
  data: any,
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
  currentGamePosition: number,
  operation: string,
  currentLevel: number,
  gameArray: GameScreen[],
  navigate: any,
  user: User,
  dispatch: any,
) => {
  const coins = await getNanakCoin(user?.uid || '');
  const condition = coins !== 0 ?
    currentLevel <= ALL_CONSTANT.LEVELS_COUNT && gameArray[currentGamePosition] :
    currentLevel < ALL_CONSTANT.LEVELS_COUNT && gameArray[currentGamePosition];

  if (gameArray.length === 0) {
    console.error('Game Array is empty');
    return;
  }
  if (condition) {
    let saveWordID = null;
    const sessionInfo = currentGamePosition !== undefined ? gameArray[currentGamePosition] : null;
    if (sessionInfo) {
      const [key, wordID, questionID] = sessionInfo.key.split('-');
      saveWordID = wordID;
      if (key) {
        navigateTo(navigate, key, wordID, sessionInfo.data, questionID);
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
          await updateCurrentProgress(user.uid, currentGamePosition);
          dispatch(setCurrentGamePosition(currentGamePosition));
        }
        break;
    }
  } else {
    navigate(`${ROUTES.WINCOIN}`);
  }
};

export default handleClick;
