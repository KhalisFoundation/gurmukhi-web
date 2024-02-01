import { QuestionType, User } from 'types/shabadavalidb';
import { GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { fetchProgress } from '../utils';
import { getRandomWord, getQuestionsByWordID } from 'database/default';
import { addWordsBatch, getRandomQuestion } from 'database/shabadavalidb';
import { MiniWord } from 'types';
import { createGameScreen } from '../utils';
import ALL_CONSTANT from 'constants/constant';
import { useAppDispatch } from 'store/hooks';
import { setCurrentGamePosition } from 'store/features/currentGamePositionSlice';
import { setCurrentLevel } from 'store/features/currentLevelSlice';
import { updateProgress } from 'database/shabadavalidb';
import { useEffect } from 'react';
import { addScreens } from 'store/features/gameArraySlice';

const useGamePlay = (user: User, toggleLoading: (value: boolean) => void, resetGame = true) => {
  const dispatch = useAppDispatch();
  const gamePlay = async () => {
    const progress: GameScreen[] | null = fetchProgress(user);
    const learningWords: WordShabadavaliDB[] = [];

    const shuffleArray = (array: GameScreen[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const addWordIfNotExists = (word: MiniWord) => {
      const exists = learningWords.some((obj) => obj.id === word.id);
      if (word.id && word.word && !exists) {
        const learningWord: WordShabadavaliDB = {
          isLearnt: false,
          progress: 0,
          isWordRead: false,
          word_id: word.id,
          word: word.word,
        };
        learningWords.push(learningWord);
      }
    };
    const getNewQuestions = async (count: number) => {
      const gameArray: GameScreen[] = [];
      let i = 0;
      while (i < count) {
        const word = await getRandomWord();
        if (word?.id) {
          const questions = await getQuestionsByWordID(word.id, true);
          addWordIfNotExists(word);
          delete word.created_at;
          delete word.updated_at;
          gameArray.push(
            createGameScreen(`${ALL_CONSTANT.DEFINITION}-${word.id}`, word),
          );
          gameArray.push(
            createGameScreen(`${ALL_CONSTANT.SENTENCES}-${word.id}`, word),
          );
          for (let j = 0; j < questions.length; j++) {
            if (word.word) {
              questions[j].word = word.word;
            }
            if (questions[j].type === 'image' && !questions[j].image && word.images) {
              questions[j].image = word.images[0];
            }

            gameArray.push(
              createGameScreen(
                `${ALL_CONSTANT.QUESTIONS_SMALL}-${word.id}-${questions[j].id}`,
                questions[j],
              ),
            );
            i += 1;
          }
        }
      }
      return gameArray;
    };

    const getRandomLearningQuestions = async (count: number) => {
      const gameArray: GameScreen[] = [];
      const questions: QuestionType[] = await getRandomQuestion(
        user.uid,
        false,
        count,
      );
      if (questions.length > 0) {
        for (const question of questions) {
          delete question.lastReviewed;
          gameArray.push(
            createGameScreen(
              `${ALL_CONSTANT.QUESTIONS_SMALL}-${question.word_id}-${question.question_id}`,
              question,
            ),
          );
        }
      }
      return gameArray;
    };
    const getRandomLearntQuestions = async (count: number) => {
      const gameArray: GameScreen[] = [];
      const questions: QuestionType[] = await getRandomQuestion(
        user.uid,
        true,
        count,
      );
      if (questions.length > 0) {
        for (const question of questions) {
          delete question.lastReviewed;
          gameArray.push(
            createGameScreen(
              `${ALL_CONSTANT.QUESTIONS_SMALL}-${question.word_id}-${question.question_id}`,
              question,
            ),
          );
        }
      }
      return gameArray;
    };

    if (progress && progress.length > 0) {
      const gameArray = progress;
      dispatch(setCurrentGamePosition(user?.progress.currentProgress));
      dispatch(setCurrentLevel(user?.progress.currentLevel));
      return { gameArray };
    }

    let learningCount = 9;
    let learntCount = 2;
    let newQuestionCount = 2;
    const learningQuestions = await getRandomLearningQuestions(learningCount);
    if (learningQuestions.length < learningCount) {
      learntCount += learningCount - learningQuestions.length;
      learningCount = learningQuestions.length;
    }
    const learntQuestions = await getRandomLearntQuestions(learntCount);

    if (learntQuestions.length < learntCount) {
      newQuestionCount += learntCount - learntQuestions.length;
      learntCount = learntQuestions.length;
    }
    const newQuestions = await getNewQuestions(newQuestionCount);
    let gameArray: GameScreen[] = [];
    if (learntCount === 0 && learningCount === 0) {
      gameArray = newQuestions as GameScreen[];
    } else {
      const combinedArrays = [...learningQuestions, ...learntQuestions];
      gameArray = shuffleArray(combinedArrays);
      gameArray = [...gameArray, ...newQuestions];
    }

    await updateProgress(user.uid, 0, gameArray, 0);
    if (learningWords.length > 0) {
      await addWordsBatch(user.uid, learningWords);
    }
    return { gameArray };
  };

  useEffect(() => {
    const fetchGamePlay = async () => {
      if (user.progress) {
        try {
          toggleLoading(true);
          const { gameArray } = await gamePlay();
          if (gameArray) {
            dispatch(addScreens(gameArray));
          }
          toggleLoading(false);
        } catch (error) {
          console.error('Error in Game Play Algo', error);
        }
      }
    };
    if (resetGame === true) {
      fetchGamePlay();
    }
  }, [user, resetGame]);
};

export default useGamePlay;
