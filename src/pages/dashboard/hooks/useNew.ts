import { GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { getRandomWord } from 'database/default';
import { getQuestionsByWordID } from 'database/default';
import {  WordType } from 'types';
import { createGameScreen } from '../utils';
import ALL_CONSTANT from 'constants/constant';
import { gameSession0 } from 'constants/gameSession0';

const useNew = () => {
  const addWordIfNotExists = (word: WordType, learningWords: WordShabadavaliDB[]) => {
    const exists = learningWords.some((obj) => obj.word_id === word.id);
    if (word.id && word.word && !exists) {
      const learningWord: WordShabadavaliDB = {
        isLearnt: false,
        progress: 0,
        isWordRead: false,
        word_id: word.id,
        word: word.word,
        image: word.images ? word.images[0] : '',
      };
      learningWords.push(learningWord);
    }
  };
  const getNewQuestions = async (count: number, learningWords: WordShabadavaliDB[], local = false) => {
    if (local) {
      gameSession0.map((word) => {
        if (word.key.includes(ALL_CONSTANT.DEFINITION)) {
          const wordData = {
            id: word.key.split('-')[1],
            ...word.data,
          } as WordType;
          addWordIfNotExists(wordData as WordType, learningWords);
        }
      });
      return { game: gameSession0, learningWords };
    }
    const game: GameScreen[] = [];
    for (let i = 0; i < count; ) {
      const word = await getRandomWord();
      if (word?.id) {
        const questions = await getQuestionsByWordID(word.id, 2, true);
        addWordIfNotExists(word, learningWords);
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
              createGameScreen(
                `${ALL_CONSTANT.QUESTIONS_SMALL}-${word.id}-${question.id}`,
                question,
              ),
            );
            i++;
          }
        }
      }
    }

    return { game, learningWords };
  };
  return getNewQuestions;
};
export default useNew;
