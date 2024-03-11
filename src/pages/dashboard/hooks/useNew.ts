import { GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { getRandomWord } from 'database/default';
import { getQuestionsByWordID } from 'database/default';
import {  WordType } from 'types';
import { createGameScreen } from '../utils';
import ALL_CONSTANT from 'constants/constant';
import seed0 from 'data/seed0.json';

const addWordIfNotExists = (word: WordType, learningWords: WordShabadavaliDB[], questionIds: string[]) => {
  const exists = learningWords.some((obj) => obj.word_id === word.id);
  if (word.id && word.word && !exists) {
    const learningWord: WordShabadavaliDB = {
      isLearnt: false,
      progress: 0,
      isWordRead: false,
      word_id: word.id,
      word: word.word,
      image: word.images ? word.images[0] : '',
      questionIds: questionIds,
    };
    learningWords.push(learningWord);
  }
};
const getNewQuestions = async (count: number, local = false, uid: string = '') => {
  const learningWords: WordShabadavaliDB[] = [];
  const game: GameScreen[] = [];
  if (local) {
    seed0.map((word) => {
      if (word.key.includes(ALL_CONSTANT.DEFINITION)) {
        const wordId = word.key.split('-')[1];
        const wordData = {
          id: wordId,
          ...word.data,
        } as WordType;
        const questionsOfWord = seed0.map((seed) => 
          (seed.key.includes('question') && seed.key.includes(wordId)) ?
            seed.key.split('-')[2] :
            null).filter((question) => question !== null) as string[];
        addWordIfNotExists(wordData as WordType, learningWords, questionsOfWord);
      }
    });

    return { game: seed0, learningWords };
  }
  const usedWordIds = [];
  for (let i = 0; i < count; ) {
    const word = await getRandomWord(uid, usedWordIds) as WordType;
    if (word?.id) {
      usedWordIds.push(word.id);
      const questions = await getQuestionsByWordID(word.id, 2, true);
      const questionIds = questions.map((question) => question.id).filter((id) => id !== undefined) as string[];
      addWordIfNotExists(word, learningWords, questionIds);
      delete word.created_at;
      delete word.updated_at;
      game.push(createGameScreen(`${ALL_CONSTANT.DEFINITION}-${word.id}`, word));
      game.push(createGameScreen(`${ALL_CONSTANT.SENTENCES}-${word.id}`, word));
      if (questions.length === 0) {
        i++;
      }
      for (const question of questions) {
        if (word.word) {
          question.word = word.word;
        }
        if (question.type === 'image' && !question.image && word.images) {
          question.image = word.images[0];
        }
        if (i < count) {
          game.push(
            createGameScreen(`${ALL_CONSTANT.QUESTIONS_SMALL}-${word.id}-${question.id}`, question),
          );
          i++;
        }
      }
    }
  }

  return { game, learningWords };
};
export default getNewQuestions;
