import { setWordIds } from 'database/shabadavalidb';
import { useEffect } from 'react';
import { User } from 'types/shabadavalidb';

function useFetchWords(user: User, toggleLoading: (value: boolean) => void) {
  useEffect(() => {
    toggleLoading(true);
    const fetchWords = async () => {
      await setWordIds(user.uid);
    };
    if (user.uid) {
      fetchWords();
    }
  }, [user]);
}

export default useFetchWords;
