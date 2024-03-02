import { User, GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { getWordsFromUser } from 'database/shabadavalidb';
import { createGameScreen } from '../utils';
import ALL_CONSTANT from 'constants/constant';
import { getQuestionsByWordID } from 'database/default';
import { QuestionData } from 'types';

const getRandomQuestions = async (user: User, count: number, isLearnt: boolean, notInArray: string[]) => {
  const gameArray: GameScreen[] = [];
  const words: WordShabadavaliDB[] = await getWordsFromUser(user.uid, count, isLearnt);
  if (words.length === 0) {
    return [];
  }
  const questionsPromises = words.map((word) => getQuestionsByWordID(word.word_id, 2, user.uid, true, notInArray));
  const questionsResults: QuestionData[][] = await Promise.all(questionsPromises);
  const questions: QuestionData[] = questionsResults.flat();
  if (questions.length === 0) {
    return [];
  }
  const finalCount = Math.min(questions.length, count);

  for (let i = 0; i < finalCount; i++) {
    if (questions[i].type === 'image') {
      const foundWord = words.find((wordObj) => wordObj.word_id === questions[i].word_id);
      if (foundWord) {
        questions[i].image = foundWord.image;
      }
    }
    gameArray.push(
      createGameScreen(
        `${ALL_CONSTANT.QUESTIONS_SMALL}-${questions[i].word_id}-${questions[i].id}`,
        questions[i],
      ),
    );
  }
  return gameArray;
};

export default getRandomQuestions;
