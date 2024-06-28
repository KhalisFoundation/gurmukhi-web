import { WordType } from 'types';

export const updateSemanticWordsData = (
  wordId: string,
  currentWord: WordType,
  WordData: WordType[],
  setWords: React.Dispatch<React.SetStateAction<WordType[]>>,
) => {
  const wordsData = WordData.filter((word) => word.id && word.id !== wordId);
  // map through synonyms and antonyms and set its type to 'synonym' or 'antonym'
  const newWordsData: WordType[] = wordsData.map((word) => {
    if (word.id) {
      if (currentWord.synonyms?.some((synonym) => synonym.id === word.id)) {
        return { ...word, type: 'synonym' };
      }
      if (currentWord.antonyms?.some((antonym) => antonym.id === word.id)) {
        return { ...word, type: 'antonym' };
      }
    }
    return word;
  });
  
  setTimeout(() => setWords(newWordsData), 0); // Use setTimeout to defer the state update
};
  