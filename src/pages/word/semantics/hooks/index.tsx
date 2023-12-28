import { WordData } from 'constants/wordsData';
import { TFunction } from 'i18next';
import { DraggableLocation } from 'react-beautiful-dnd';

export const semanticsOnDrag = (
  source: DraggableLocation,
  destination: DraggableLocation | null | undefined,
  textGetter: TFunction<'translation', undefined>,
  words: WordData[],
  synonyms: WordData[],
  antonyms: WordData[],
  setWords: React.Dispatch<React.SetStateAction<WordData[]>>,
  setSynonyms: React.Dispatch<React.SetStateAction<WordData[]>>,
  setAntonyms: React.Dispatch<React.SetStateAction<WordData[]>>,
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
  const [foundItem] = newData.splice(source.index, 1);

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
  wordId: string | null,
  currentWord: WordData,
  wordData: WordData[],
  setWords: React.Dispatch<React.SetStateAction<WordData[]>>,
) => {
  const wordsData = wordData.filter((word) => word.id && word.id !== Number(wordId));
  // map through synonyms and antonyms and set its type to 'synonym' or 'antonym'
  const newWordsData: WordData[] = wordsData.map((word) => {
    if (currentWord.synonyms?.includes(Number(word.id))) {
      return { ...word, type: 'synonym' };
    }
    if (currentWord.antonyms?.includes(Number(word.id))) {
      return { ...word, type: 'antonym' };
    }
    return word;
  });
  // save all to words state
  setWords(newWordsData);
};

export const processWords = (
  wordList: WordData[],
  type: keyof WordData,
  jumpBoxRef: React.MutableRefObject<any>,
  currentWord: WordData,
  words: WordData[],
  synonyms: WordData[],
  antonyms: WordData[],
  setWords: React.Dispatch<React.SetStateAction<WordData[]>>,
  setSynonyms: React.Dispatch<React.SetStateAction<WordData[]>>,
  setAntonyms: React.Dispatch<React.SetStateAction<WordData[]>>,
) => {
  wordList.forEach((word) => {
    if (!(currentWord[type] as (number | string)[]).includes(Number(word.id))) {
      jumpBoxRef.current?.classList.remove('bg-green-500');
      jumpBoxRef.current.classList.add('jump-box');
      jumpBoxRef.current.classList.add('bg-red-500');
      setTimeout(() => {
        jumpBoxRef.current?.classList.remove('jump-box');

        if (type === 'synonyms') {
          setSynonyms(synonyms.filter((synonym) => synonym.id !== Number(word.id)));
        } else if (type === 'antonyms') {
          setAntonyms(antonyms.filter((antonym) => antonym.id !== Number(word.id)));
        }

        setWords([...words, word]);
      }, 1000);
    } else {
      jumpBoxRef.current.classList.add('bg-green-500');
      jumpBoxRef.current.classList.add('z-0');
    }
  });
};
