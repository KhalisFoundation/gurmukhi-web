import { getNewWords } from 'database/shabadavalidb';
import { useEffect, useState } from 'react';
import { User } from 'types/shabadavalidb';
import { WordType } from 'types';
function useNewWord(user: User, toggleLoading: (value: boolean) => void) {
  const [randomWord, setRandomWord] = useState<WordType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const newWord = await getNewWords(user.uid, false);
      if (!newWord) {
        return null;
      }
      setRandomWord(newWord);

      toggleLoading(false);
    };

    fetchData();
  }, []);
  return randomWord;
}

export default useNewWord;
