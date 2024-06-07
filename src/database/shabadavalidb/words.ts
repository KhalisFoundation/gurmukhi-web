import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  limit,
  Timestamp,
  arrayUnion,
  writeBatch,
  updateDoc,
} from 'firebase/firestore';
import { shabadavaliDB } from '../../firebase';
import { WordShabadavaliDB } from 'types';
import ALL_CONSTANT from 'constants/constant';
import { usersCollection } from './users';
import { shuffleArray } from 'pages/dashboard/utils';
import { bugsnagErrorHandler } from 'utils';
import CONSTANTS from 'constants/constant';
import { getActiveWords, getWordById } from 'database/default';

export const getWordCollectionRef = (uid: string) => {
  return collection(shabadavaliDB, ALL_CONSTANT.USERS, uid, ALL_CONSTANT.WORDS);
};

export const addWordsToSubCollection = async (uid: string, data: WordShabadavaliDB) => {
  try {
    console.log('');
    const wordsCollectionRef = getWordCollectionRef(uid);
    await addDoc(wordsCollectionRef, data);
  } catch (error) {
    bugsnagErrorHandler(error, 'database/shabadavalidb/words.ts/addWordsToSubCollection', data);
  }
};

export const getWords = async (uid: string, isLearnt: boolean) => {
  try {
    console.log('function getWords');
    const wordsCollectionRef = getWordCollectionRef(uid);
    const q = query(
      wordsCollectionRef,
      where('isLearnt', '==', isLearnt),
      where('isWordRead', '==', true),
      limit(CONSTANTS.GET_WORD_LIMIT),
    );
    // may add a time condition
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    }
    const documents = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    return shuffleArray(documents);
  } catch (error) {
    bugsnagErrorHandler(error, 'database/shabadavalidb/words.ts/getWords', {
      isLearnt: isLearnt,
    });
    return [];
  }
};

export const addQuestionsBatch = async (
  uid: string,
  wordToQuestionIdsMap: Map<string, string[]>,
) => {
  console.log('function addQuestionsBatch');
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const batch = writeBatch(shabadavaliDB);
    wordToQuestionIdsMap.forEach((questionIds, wordId) => {
      const documentRef = doc(wordsCollectionRef, wordId);
      batch.update(documentRef, {
        questionIds: arrayUnion(...questionIds),
      });
    });

    await batch.commit();
  } catch (error) {
    bugsnagErrorHandler(
      error,
      'database/shabadavalidb/words.ts/addQuestionBatch',
      addQuestionsBatch,
    );
  }
};

export const addWordsBatch = async (uid: string, words: WordShabadavaliDB[]) => {
  console.log('function addWordsBatch');
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const wordIds = [];
    const batch = writeBatch(shabadavaliDB);
    for (const wordData of words) {
      wordIds.push(wordData.word_id);
      const q = query(wordsCollectionRef, where('word_id', '==', wordData.word_id));
      const querySnapshot = await getDocs(q);
      wordData.lastReviewed = Timestamp.fromDate(new Date());
      const docRef = doc(wordsCollectionRef, wordData.word_id);
      if (querySnapshot.empty) {
        batch.set(docRef, wordData);
      } else {
        batch.update(docRef, {
          isWordRead: wordData.isWordRead,
          questionIds: wordData.questionIds,
          lastReviewed: wordData.lastReviewed,
        });
      }
    }
    const userDocRef = doc(usersCollection, uid);
    batch.update(userDocRef, {
      wordIds: arrayUnion(...wordIds),
    });

    await batch.commit();
  } catch (error) {
    bugsnagErrorHandler(error, 'database/shabadavalidb/words.ts/addWordsBatch', words);
  }
};

export const updateWordFromUser = async (uid: string, wordID: string) => {
  console.log('function updateWordFromUser');
  const wordsCollectionRef = getWordCollectionRef(uid);
  const batch = writeBatch(shabadavaliDB);
  try {
    const q = query(wordsCollectionRef, where('word_id', '==', wordID));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const wordDoc = querySnapshot.docs[0];
      const wordData = wordDoc.data() as WordShabadavaliDB;
      const currentProgress = wordData.progress;
      let isLearnt = wordData.isLearnt;
      if (currentProgress + CONSTANTS.DEFAULT_ONE >= CONSTANTS.LEARNT_THRESHOLD && !isLearnt) {
        const userDocRef = doc(usersCollection, uid);
        batch.update(userDocRef, {
          learntWordIds: arrayUnion(wordID),
        });
        isLearnt = true;
      }
      const documentRef = doc(wordsCollectionRef, querySnapshot.docs[0].id);
      batch.update(documentRef, {
        progress: currentProgress + CONSTANTS.DEFAULT_ONE,
        isLearnt: isLearnt,
        lastReviewed: Timestamp.fromDate(new Date()),
      });
      await batch.commit();
    }
  } catch (error) {
    bugsnagErrorHandler(error, 'updateWordFromUser', { uid, wordID });
  }
};

export const checkIfWordPresent = async (uid: string, wordID: string) => {
  console.log('function checkIfWordPresent');
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const q = query(wordsCollectionRef, where('word_id', '==', wordID));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    bugsnagErrorHandler(error, 'checkIfWordPresent', { uid, wordID });
  }
};

export const getLearntWords = async (uid: string) => {
  console.log('function getLearntWords');
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const q = query(wordsCollectionRef, where('isLearnt', '==', true));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    return documents as WordShabadavaliDB[];
  } catch (error) {
    bugsnagErrorHandler(error, 'getLearntWords', { uid });
  }
};

export const updateWordRead = async (uid: string, wordID: string) => {
  console.log('function updateWordRead');
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const docRef = doc(wordsCollectionRef, wordID);
    await updateDoc(docRef, { isWordRead: true });
  } catch (error) {
    bugsnagErrorHandler(error, 'updateWordRead', { uid });
  }
};

export const getNewWords = async (uid: string, isUpdateWordRead: boolean = true) => {
  console.log('function getNewWords');
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const queryRef = query(
      wordsCollectionRef,
      where('isWordRead', '==', false),
      limit(CONSTANTS.DEFAULT_ONE),
    );
    const snapshot = await getDocs(queryRef);

    if (snapshot.empty) {
      return null;
    }
    const shabadavaliWordData: WordShabadavaliDB[] = snapshot.docs.map((document) => ({
      ...(document.data() as WordShabadavaliDB), // If doc.data() contains an 'id', it's spread here
      id: document.id, // This 'id' overwrites the previous one
    }));
    if (shabadavaliWordData.length === 0) {
      return null;
    }
    const wordID: string | null = shabadavaliWordData[0].id ? shabadavaliWordData[0].id : null;
    if (!wordID) {
      return;
    }
    const wordDefination = await getWordById(wordID, true);

    // Update the isWordRead only while the word is used in the gameSession
    if (isUpdateWordRead) {
      await updateWordRead(uid, wordID);
    }

    return wordDefination;
  } catch (error) {
    bugsnagErrorHandler(error, 'getNewWords', { uid });
  }
};

export const checkIfWordCollectionExists = async (uid: string) => {
  console.log('function checkIfWordCollectionExists');
  try {
    const wordsCollectionData = await getDocs(getWordCollectionRef(uid));
    if (wordsCollectionData.empty) {
      return false;
    }
    return true;
  } catch (error) {
    bugsnagErrorHandler(error, 'checkIfWordCollectionExists', { uid });
  }
};

export const setWordIds = async (uid: string) => {
  console.log('function setWordIDs');
  try {
    const batch = writeBatch(shabadavaliDB);
    const wordsCollectionRef = getWordCollectionRef(uid);

    const isWordCollectionExists = await checkIfWordCollectionExists(uid);
    if (isWordCollectionExists) {
      return null;
    }
    const words = await getActiveWords();
    if (!words) {
      return null;
    }
    for (const item of words) {
      const wordRef = doc(wordsCollectionRef, item.id);
      batch.set(wordRef, {
        word_id: item.id,
        word: item.word,
        image: item.images && item.images.length > 0 ? item.images[0] : undefined,
        isLearnt: false,
        isWordRead: false,
        lastReviewed: null,
        progress: 0,
        questionIds: [],
      });
    }
    await batch.commit();
  } catch (error) {
    bugsnagErrorHandler(error, 'setWordIDs', { uid });
  }
};
