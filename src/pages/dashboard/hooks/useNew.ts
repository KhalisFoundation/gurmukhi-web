import { GameScreen, WordShabadavaliDB } from 'types/shabadavalidb';
import { getQuestions, getWordById, getSemanticsByIds } from 'database/default';
import { MiniWord, Semantic, WordType } from 'types';
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
      image: word.images ? word.images[0] : '',
      questionIds: questionIds,
      id: word.id,
    };
    learningWords.push(learningWord);
  }
};

const getNewQuestions = async (count: number, local = false, uid: string = '') => {
  const learningWords: WordShabadavaliDB[] = [];
  const semanticIds: { [key: string]: string[] }[] = [];
  const semantics: Semantic[] = [];
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
  if (!words) {
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
    game.push(createGameScreen(`${ALL_CONSTANT.SEMANTICS}-${word.id}`, wordDefinition));
        
    let wordSemantics: (string | MiniWord)[] = [];
    if (wordDefinition?.synonyms) wordSemantics = wordDefinition?.synonyms;
    if (wordDefinition?.antonyms) wordSemantics = wordSemantics.concat(wordDefinition?.antonyms);

    wordSemantics.map((semantic) => {
      if (word.id) {
        if (typeof semantic === 'string') {
          const wordId = word.id.toString();
          const semanticId = semanticIds.find((obj) => obj[wordId] !== undefined);
          if (semanticId) {
            semanticId[wordId].push(semantic);
          } else {
            const newEntry = { [wordId]: [semantic] };
            semanticIds.push(newEntry);
          } 
        } else {
          if (semantic.id && semantic.word && semantic.translation) {
            const semanticWord: Semantic = {
              id: semantic.id,
              word_id: word.id,
              word: semantic.word,
              translation: semantic.translation,
            };
            semantics.push(semanticWord);
          }
        }
      }
    });

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

      const semanticsData = await getSemanticsByIds(semanticIds, []);

      semanticsData.synonyms.forEach((semantic) => {
        const wordId = word?.id;
        if (!wordId) {
          return;
        }
        const wordEntry = semanticIds.find((obj) => obj[wordId] !== undefined);
        if (wordEntry && semantic.id && semantic.word && semantic.translation) {
          const semanticWord: Semantic = {
            id: semantic.id,
            word_id: wordId,
            word: semantic.word,
            translation: semantic.translation,
          };
          semantics.push(semanticWord);
        }
      });
    }
  }

  return { game, learningWords, semantics };
};

export default getNewQuestions;
