import React, { MutableRefObject } from 'react';
import { Draggable, DroppableProvided } from 'react-beautiful-dnd';
import { TFunction } from 'i18next';
import { WordData } from 'constants/wordsData';
import { wordsdb } from '../firebase';
import { DocumentData, collection, doc, documentId, getDoc, getDocs, limit, query, where } from 'firebase/firestore';

const convertToTitleCase = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const addEndingPunctuation = (sentence: string, lang: string) => {
  const punctuation = lang === 'gurmukhi' ? '।' : '.';
  const numberOfSpaces = (sentence.match(/ /g) || []).length;
  if (numberOfSpaces === 0 && lang === 'gurmukhi') return sentence.replace(/।/g, '');
  return numberOfSpaces === 0 || sentence.endsWith(punctuation) || sentence.endsWith('?') ? sentence : sentence + punctuation;
};

const highlightWord = (sentence: string, word: string, lang?: string) => {
  // check if word in sentence
  if (!sentence.includes(word)) {
    return sentence;
  }
  const splitSentence = sentence.split(word);
  return (
    <span className="text-slate-500 gurmukhi font-semibold">
      {splitSentence[0]}
      <span className="text-black">{word}</span>
      {lang ? addEndingPunctuation(splitSentence[1], lang) : splitSentence[1] }
    </span>
  );
};

const createSemanticDraggables = (
  provided: DroppableProvided, wordList: WordData[], 
  type: string, text: TFunction<'translation', undefined>, 
  originalSemantics: (string | number)[],
  disableDroppable: React.Dispatch<React.SetStateAction<boolean>>,
  boxRef?: MutableRefObject<any>,
) => {
  const synonyms = text('SYNONYMS');
  const antonyms = text('ANTONYMS');
  const droppableId = type;
  const heading = type === synonyms.toLowerCase() ? synonyms : antonyms;
  const semanticsLeft = originalSemantics.filter(
    (wordId) => !wordList.some((word) => word.id === wordId),
  ).length;
  if (semanticsLeft === 0) disableDroppable(true);
  return (
    <div
      className='h-72 w-80 p-4 cardImage bg-cover bg-sky-100 bg-blend-soft-light border-2 border-sky-200 shadow-lg rounded-lg'
      ref={provided.innerRef}
      {...provided.droppableProps}>
      <h2 className='text-center text-black tracking-widest'>{`${heading.toUpperCase()} - ${semanticsLeft === 0 ? '✓' : semanticsLeft}`}</h2>
      <div className='grid grid-cols-2 gap-4 h-60 w-72'>
        {wordList?.map((word, index) => {
          return (
            <Draggable 
              key={droppableId + word.id?.toString()}
              draggableId={droppableId + word.id?.toString()}
              isDragDisabled={semanticsLeft == 0}
              index={index}>
              {(dragProvided) => {
                return (
                  <div
                    draggable
                    className={'flex h-min w-max m-4 p-4 text-white text-sm rounded-lg z-10'}

                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    ref={(el) => {
                      dragProvided.innerRef(el);
                      if (boxRef) boxRef.current = el;
                    }}>
                    {word.word}
                  </div>
                );
              }}
            </Draggable>
          );
        })}
      </div>
      {provided.placeholder}
    </div>
  );
};

const wordsCollection = collection(wordsdb, 'words');
const sentencesCollection = collection(wordsdb, 'sentences');

// Function to generate a random alphanumeric ID
const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < 20; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomId;
};

const fetchSentencesFromWordId = async (wordId: string) => {
  const sentencesData: DocumentData[] = [];
  const queryRef = query(sentencesCollection, where('word_id', '==', wordId));
  const sentences = await getDocs(queryRef);

  sentences.docs.forEach((sentence) => {
    sentencesData.push(sentence.data());
  });
  return sentencesData;
};

const fetchDataFromCollection = async (id: string, collectionName: string) => {
  const docRef = doc(wordsdb, collectionName, id);
  const wordSnapshot = await getDoc(docRef);
  const wordData = wordSnapshot.data() as WordData;
  return wordData;
};

const fetchMiniWordById = async (wordId: string) => {
  const docRef = doc(wordsdb, 'words', wordId);
  const wordSnapshot = await getDoc(docRef);

  const { word, translation } = wordSnapshot.data() as WordData;
  
  return {
    id: wordId,
    word,
    translation,
  };
};

const getSemanticsByIds = async (synonymsIds: string[], antonymsIds: string[]) => {
  const synonymsPromises: any = (synonymsIds || []).map((synonym) => fetchMiniWordById(synonym.toString()));
  const antonymsPromises: any = (antonymsIds || []).map((antonym) => fetchMiniWordById(antonym.toString()));

  const [synonyms, antonyms] = await Promise.all([Promise.all(synonymsPromises), Promise.all(antonymsPromises)]);

  return {
    synonyms,
    antonyms,
  };
};

const getWordById = async (wordId: string, needExtras = false) => {
  const docRef = doc(wordsdb, 'words', wordId);
  const wordSnapshot = await getDoc(docRef);
  
  if (wordSnapshot.exists()) {
    const wordData = wordSnapshot.data() as WordData;
    
    if (needExtras) {
      const { synonyms, antonyms } = await getSemanticsByIds(wordData.synonyms as string[], wordData.antonyms as string[]);
      
      return {
        ...wordData,
        id: wordId,
        synonyms,
        antonyms,
      };
    } else {
      return {
        ...wordData,
        id: wordId,
      };
      
    }
  } else {
    console.log('No such document!');
    return null;
  }
};

const getRandomWord: () => Promise<WordData> = async () => {
  // get random word from wordsCollection from firestore
  const randomId = generateRandomId();
  const queryRef = query(wordsCollection, where(documentId(), '>=', randomId), where('status', '==', 'active'), limit(1));
  const wordSnapshot = await getDocs(queryRef);

  if (!wordSnapshot.empty) {
    const wordData = wordSnapshot.docs[0].data() as WordData;
    const wordId = wordSnapshot.docs[0].id;
    const sentences = await fetchSentencesFromWordId(wordId);
    const { synonyms, antonyms } = await getSemanticsByIds(
      wordData.synonyms as string[], 
      wordData.antonyms as string[],
    );

    return {
      ...wordData,
      id: wordId,
      sentences,
      synonyms,
      antonyms,
    } as WordData;
  } else {
    return getRandomWord();
  }
};

export { 
  addEndingPunctuation,
  highlightWord,
  convertToTitleCase, 
  createSemanticDraggables,
  getRandomWord,
  getWordById,
  fetchDataFromCollection,
  fetchSentencesFromWordId,
};