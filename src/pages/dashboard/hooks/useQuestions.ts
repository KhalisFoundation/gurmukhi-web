import { User, GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { addQuestionsBatch, getWordsFromUser } from 'database/shabadavalidb';
import { createGameScreen } from '../utils';
import ALL_CONSTANT from 'constants/constant';
import { getQuestionsByWordID } from 'database/default';
import { QuestionData } from 'types';


const getRandomQuestions = async (user: User, count: number, isLearnt: boolean) => {
  const gameArray: GameScreen[] = [];
  const words: WordShabadavaliDB[] = await getWordsFromUser(user.uid, count, isLearnt);
  if (words.length === 0) {
    return [];
  }
  let questionsPromises;
  if (isLearnt) {
    questionsPromises = words.map((word) => getQuestionsByWordID(word.word_id, 2, true));
  } else {
    questionsPromises = words.map((word) => getQuestionsByWordID(word.word_id, 2, true, word.questionIds));
  }
  const questionsResults: QuestionData[][] = await Promise.all(questionsPromises);
  const questions: QuestionData[] = questionsResults.flat();
  if (questions.length === 0) {
    return [];
  }
  const finalCount = Math.min(questions.length, count);
  const wordToQuestionMap = new Map<string, string[]>();
  for (let i = 0; i < finalCount; i++) {
    const question = questions[i];
    const wordQuestions = wordToQuestionMap.get(question.word_id) || [];
    wordQuestions.push(question.id ?? '');
    wordToQuestionMap.set(question.word_id, wordQuestions);
    if (question.type === 'image') {
      const foundWord = words.find((wordObj) => wordObj.word_id === question.word_id);
      if (foundWord) {
        question.image = foundWord.image;
      }
    }
    gameArray.push(
      createGameScreen(
        `${ALL_CONSTANT.QUESTIONS_SMALL}-${question.word_id}-${question.id}`,
        question,
      ),
    );
  }
  await addQuestionsBatch(user.uid, wordToQuestionMap);
  return gameArray;
};

export default getRandomQuestions;
