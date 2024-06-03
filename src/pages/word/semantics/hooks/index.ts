import { WordType } from 'types';
import { TFunction } from 'i18next';
import { DraggableLocation } from 'react-beautiful-dnd';
import CONSTANTS from 'constants/constant';

export const semanticsOnDrag = (
  source: DraggableLocation,
  destination: DraggableLocation | null | undefined,
  textGetter: TFunction<'translation', undefined>,
  words: WordType[],
  synonyms: WordType[],
  antonyms: WordType[],
  setWords: React.Dispatch<React.SetStateAction<WordType[]>>,
  setSynonyms: React.Dispatch<React.SetStateAction<WordType[]>>,
  setAntonyms: React.Dispatch<React.SetStateAction<WordType[]>>,
) => {
  const newWords = Array.from(words);
  const synonymsText = textGetter('SYNONYMS');
  const antonymsText = textGetter('ANTONYMS');
  let newSynonyms = Array.from(synonyms);
  let newAntonyms = Array.from(antonyms);

  let newData = Array.from(words);

  switch (source.droppableId) {
    case synonymsText.toLowerCase():
      newData = newSynonyms;
      break;
    case antonymsText.toLowerCase():
      newData = newAntonyms;
      break;
    default:
      break;
  }
  const [foundItem] = newData.splice(source.index, CONSTANTS.DEFAULT_ONE);

  if (!destination) return;
  if (source.droppableId !== destination.droppableId) {
    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;
    if (sourceId === textGetter('ALL_WORDS')) {
      const newWordLists = newWords.filter((word) => word.id !== foundItem.id);
      switch (destinationId) {
        case synonymsText.toLowerCase():
          setSynonyms([...synonyms, foundItem]);
          setWords(newWordLists);
          break;
        case antonymsText.toLowerCase():
          setAntonyms([...antonyms, foundItem]);
          setWords(newWordLists);
          break;
        default:
          break;
      }
    } else {
      switch (destinationId) {
        case textGetter('ALL_WORDS'):
          if (sourceId === synonymsText.toLowerCase()) {
            newSynonyms = synonyms.filter((synonym) => synonym.id !== foundItem.id);
            setSynonyms(newSynonyms);
            setWords([...newWords, foundItem]);
          } else if (sourceId === antonymsText.toLowerCase()) {
            newAntonyms = antonyms.filter((antonym) => antonym.id !== foundItem.id);
            setAntonyms(newAntonyms);
            setWords([...newWords, foundItem]);
          }
          break;
        case synonymsText.toLowerCase():
          if (sourceId === antonymsText.toLowerCase()) {
            newAntonyms = antonyms.filter((antonym) => antonym.id !== foundItem.id);
            setAntonyms(newAntonyms);
            setSynonyms([...newSynonyms, foundItem]);
          }
          break;
        case antonymsText.toLowerCase():
          if (sourceId === synonymsText.toLowerCase()) {
            newSynonyms = synonyms.filter((synonym) => synonym.id !== foundItem.id);
            setSynonyms(newSynonyms);
            setAntonyms([...newAntonyms, foundItem]);
          }
          break;
        default:
          break;
      }
    }
  } else {
    newData.splice(destination.index, 0, foundItem);
    if (source.droppableId === synonymsText.toLowerCase()) setSynonyms(newData);
    else if (source.droppableId === antonymsText.toLowerCase()) setAntonyms(newData);
    else setWords(newData);
  }
};

export const updateSemanticWordsData = (
  wordId: string,
  currentWord: WordType,
  WordData: WordType[],
  setWords: React.Dispatch<React.SetStateAction<WordType[]>>,
) => {
  const wordsData = WordData.filter((word) => word.id && word.id !== wordId);
  // map through synonyms and antonyms and set its type to 'synonym' or 'antonym'
  const newWordsData: WordType[] = wordsData.map((word) => {
    // if (word.id) {
    //   if (currentWord.synonyms?.includes(word.id)) {
    //     return { ...word, type: 'synonym' };
    //   }
    //   if (currentWord.antonyms?.includes(word.id)) {
    //     return { ...word, type: 'antonym' };
    //   }
    // }
    return word;
  });
  // save all to words state
  setWords(newWordsData);
};

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
      jumpBoxRef.current?.classList.remove('bg-green-500');
      jumpBoxRef.current.classList.add('jump-box');
      jumpBoxRef.current.classList.add('bg-red-500');
      setTimeout(() => {
        jumpBoxRef.current?.classList.remove('jump-box');

        if (type === 'synonyms') {
          setSynonyms(synonyms.filter((synonym) => synonym.id !== word.id));
        } else if (type === 'antonyms') {
          setAntonyms(antonyms.filter((antonym) => antonym.id !== word.id));
        }

        setWords([...words, word]);
      }, CONSTANTS.JUMP_BOX_TIMEOUT);
    } else {
      jumpBoxRef.current.classList.add('bg-green-500');
      jumpBoxRef.current.classList.add('z-0');
    }
  });
};
