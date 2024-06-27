import CONSTANTS from 'constants/constant';
import { WordType } from 'types';

export const processWords = (
  wordList: WordType[],
  type: keyof WordType,
  jumpBoxRef: React.MutableRefObject<any>,
  currentWord: WordType,
  words: WordType[],
  synonyms: WordType[],
  antonyms: WordType[],
  setWords: React.Dispatch<React.SetStateAction<WordType[]>>,
  setSynonyms: React.Dispatch<React.SetStateAction<WordType[]>>,
  setAntonyms: React.Dispatch<React.SetStateAction<WordType[]>>,
) => {
  wordList.forEach((word) => {
    if (
      currentWord[type] &&
        !(currentWord[type] as (number | string)[]).includes(Number(word.id))
    ) {
      jumpBoxRef.current.classList.remove('bg-green-500');
      jumpBoxRef.current.classList.add('jump-box');
      jumpBoxRef.current.classList.add('bg-red-500');
      setTimeout(() => {
        jumpBoxRef.current.classList.remove('jump-box');
          
        setTimeout(() => {
          if (type === 'synonyms') {
            setSynonyms(synonyms.filter((synonym) => synonym.id !== word.id));
          } else if (type === 'antonyms') {
            setAntonyms(antonyms.filter((antonym) => antonym.id !== word.id));
          }
    
          setWords([...words, word]);
        }, 0); // Use setTimeout to defer the state update
      }, CONSTANTS.JUMP_BOX_TIMEOUT);
    } else {
      jumpBoxRef.current.classList.add('bg-green-500');
      jumpBoxRef.current.classList.add('z-0');
    }
  });
};
  