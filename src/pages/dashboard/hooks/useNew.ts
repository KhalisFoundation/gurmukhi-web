import { GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { getRandomWord } from 'database/default';
import { getQuestionsByWordID } from 'database/default';
import {  WordType } from 'types';
import { createGameScreen } from '../utils';
import ALL_CONSTANT from 'constants/constant';

const useNew = ()=>{
  const addWordIfNotExists = (word: WordType, learningWords:WordShabadavaliDB[]) => {
    const exists = learningWords.some((obj) => obj.word_id === word.id);
    if (word.id && word.word && !exists) {
      const learningWord: WordShabadavaliDB = {
        isLearnt: false,
        progress: 0,
        isWordRead: false,
        word_id: word.id,
        word: word.word,
        image:word.images ? word.images[0] : '',
      };
      learningWords.push(learningWord);
    }
  };
  const getNewQuestions = async (count: number, learningWords:WordShabadavaliDB[]) => {
    const game: GameScreen[] = [];
    let i = 0;
    while (i < count) {
      const word = await getRandomWord();
      if (word?.id) {
        const questions = await getQuestionsByWordID(word.id, 2, true);
        addWordIfNotExists(word, learningWords);
        delete word.created_at;
        delete word.updated_at;
        game.push(
          createGameScreen(`${ALL_CONSTANT.DEFINITION}-${word.id}`, word),
        );
        game.push(
          createGameScreen(`${ALL_CONSTANT.SENTENCES}-${word.id}`, word),
        );
        for (let j = 0; j < questions.length; j++) {
          if (word.word) {
            questions[j].word = word.word;
          }
          if (
            questions[j].type === 'image' &&
                !questions[j].image &&
                word.images
          ) {
            questions[j].image = word.images[0];
          }

          game.push(
            createGameScreen(
              `${ALL_CONSTANT.QUESTIONS_SMALL}-${word.id}-${questions[j].id}`,
              questions[j],
            ),
          );
          i += 1;
        }
      }
    }

    return { game, learningWords };
  };
  return getNewQuestions;
};
export default useNew;
