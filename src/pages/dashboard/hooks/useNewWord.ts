import { getNewWords } from 'database/shabadavalidb';
import { useEffect, useState } from 'react';
import { User, WordShabadavaliDB } from 'types/shabadavalidb';
import { WordType } from 'types';
import CONSTANTS from 'constants/constant';
import { getWordById } from 'database/default';

function useNewWord(user: User, toggleLoading: (value: boolean) => void) {
  const [randomWord, setRandomWord] = useState<WordType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const newWord: WordShabadavaliDB[] | null = await getNewWords(
        user.uid,
        CONSTANTS.DEFAULT_ONE,
      );
      if (newWord === null || newWord.length === 0) {
        setRandomWord(null);
        return;
      }
      const wordDefination: WordType | null = await getWordById(newWord[0].word_id, true);
      if (wordDefination === null) {
        setRandomWord(null);
        return null;
      }
      setRandomWord(wordDefination);

      toggleLoading(false);
    };

    fetchData();
  }, []);
  return randomWord;
}

export default useNewWord;
