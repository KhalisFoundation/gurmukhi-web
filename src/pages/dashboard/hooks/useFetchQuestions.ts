import useQuestions from './useQuestions';
import useNew from './useNew';
import { WordShabadavaliDB, GameScreen, User } from 'types/shabadavalidb';
import { shuffleArray } from '../utils';
import { addWordsBatch } from 'database/shabadavalidb';
import { updateProgress } from 'database/shabadavalidb';
import { useAppDispatch } from 'store/hooks';
import { addScreens } from 'store/features/gameArraySlice';
import { fetchProgress } from '../utils';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { setCurrentLevel } from 'store/features/currentLevelSlice';

const useFetchQuestions = (user: User) => {
  const getRandomQuestions = useQuestions(user);
  const getNewQuestions = useNew();
  const inProgressWords: WordShabadavaliDB[] = [];
  const dispatch = useAppDispatch();
  const storeQuestions = async (levels: number) => {
    const progress: GameScreen[] | null = await fetchProgress(user);
    if (progress && progress.length > 0) {
      console.log('progress', progress);
      dispatch(setCurrentGamePosition(user?.progress.currentProgress));
      dispatch(setCurrentLevel(user?.progress.currentLevel));
      dispatch(addScreens(progress));
      return;
    }
    let learningCount = Math.floor(0.7 * levels) !== 0 ? Math.floor(0.7 * levels) : 1;
    let learntCount = Math.floor(0.2 * levels) !== 0 ? Math.floor(0.2 * levels) : 1;
    let newQuestionCount = levels - (learningCount + learntCount);
    const learningQuestions = await getRandomQuestions(learningCount, false);
    if (learningQuestions.length < learningCount) {
      learntCount += learningCount - learningQuestions.length;
      learningCount = learningQuestions.length;
    }
    const learntQuestions = await getRandomQuestions(learntCount, true);

    if (learntQuestions.length < learntCount) {
      newQuestionCount += learntCount - learntQuestions.length;
      learntCount = learntQuestions.length;
    }
    const { game, learningWords } = await getNewQuestions(newQuestionCount, inProgressWords);
    let gameArray: GameScreen[] = [];
    if (learntCount === 0 && learningCount === 0) {
      gameArray = game as GameScreen[];
    } else {
      const combinedArrays = [...learningQuestions, ...learntQuestions];
      gameArray = shuffleArray(combinedArrays);
      gameArray = [...gameArray, ...game];
    }

    if (learningWords.length > 0) {
      await addWordsBatch(user.uid, learningWords);
    }
    await updateProgress(user.uid, 0, gameArray, 0);
    dispatch(addScreens(gameArray));
  };
  return storeQuestions;
};
export default useFetchQuestions;
