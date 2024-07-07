import { GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { getQuestions, getWordById } from 'database/default';
import { WordType } from 'types';
import { createGameScreen } from '../utils';
import ALL_CONSTANT from 'constants/constant';
import seed0 from 'data/seed0.json';
import { getNewWords } from 'database/shabadavalidb';

const addWordIfNotExists = (
  word: WordType,
  learningWords: WordShabadavaliDB[],
  questionIds: string[],
) => {
  const exists = learningWords.some((obj) => obj.word_id === word.id);
  if (word.id && word.word && !exists) {
    const learningWord: WordShabadavaliDB = {
      isLearnt: false,
      progress: 0,
      isWordRead: true,
      word_id: word.id,
      word: word.word,
      audioURL: word.audioURL,
      image: word.images ? word.images[0] : '',
      questionIds: questionIds,
      id: word.id,
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
        const questionsOfWord = seed0
          .map((seed) =>
            seed.key.includes('question') && seed.key.includes(wordId)
              ? seed.key.split('-')[2]
              : null,
          )
          .filter((question) => question !== null) as string[];
        addWordIfNotExists(wordData as WordType, learningWords, questionsOfWord);
      }
    });

    return { game: seed0, learningWords };
  }
  const usedWordIds = [];
  const words: WordShabadavaliDB[] | null = await getNewWords(uid, count);
  console.log('words:', words);
  if (!words) {
    console.log('No new words found', words);
    return { game: seed0, learningWords };
  }
  let questionCount = 0;
  for (const word of words) {
    if (questionCount >= count) {
      break;
    }
    const wordDefinition: WordType | null = await getWordById(word.word_id, true);
    usedWordIds.push(word.word_id);
    const questions = await getQuestions(word.word_id, usedWordIds);
    if (questions.length === 0) {
      continue;
    }
    const questionIds = questions
      .map((question) => question.id)
      .filter((id) => id !== undefined) as string[];
    if (wordDefinition === null) {
      continue;
    }
    addWordIfNotExists(wordDefinition, learningWords, questionIds);
    delete wordDefinition.created_at;
    delete wordDefinition.updated_at;
    game.push(createGameScreen(`${ALL_CONSTANT.DEFINITION}-${word.id}`, wordDefinition));
    game.push(createGameScreen(`${ALL_CONSTANT.SENTENCES}-${word.id}`, wordDefinition));

    for (const question of questions) {
      if (word.word) {
        question.word = word.word;
      }
      if (question.type === 'image' && !question.image && wordDefinition.images) {
        question.image = wordDefinition.images[0];
      }
      if (questionCount < count) {
        game.push(
          createGameScreen(`${ALL_CONSTANT.QUESTIONS_SMALL}-${word.id}-${question.id}`, question),
        );
        questionCount++;
      } else {
        break;
      }
    }
  }

  return { game, learningWords };
};

export default getNewQuestions;
