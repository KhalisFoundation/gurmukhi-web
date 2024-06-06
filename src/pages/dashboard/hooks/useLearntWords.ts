import { getLearntWords } from 'database/shabadavalidb';
import { useEffect, useState } from 'react';
import { User } from 'types/shabadavalidb';
import { WordShabadavaliDB } from 'types';
function useLearntWords(user: User, toggleLoading: (value: boolean) => void) {
  const [wordsLearnt, setWordsLearnt] = useState<WordShabadavaliDB[] | null>(null);
  useEffect(() => {
    const fetchWords = async () => {
      const words = await getLearntWords(user.uid);
      if (!words) {
        return null;
      }
      setWordsLearnt(words);
      toggleLoading(false);
    };
    if (user.uid) {
      fetchWords();
    }
  }, [user.uid]);
  return wordsLearnt;
}

export default useLearntWords;
