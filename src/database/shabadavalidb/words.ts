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
  WriteBatch,
} from 'firebase/firestore';
import { shabadavaliDB } from '../../firebase';
import { ProgressData, WordQuestionMap, WordShabadavaliDB } from 'types';
import ALL_CONSTANT from 'constants/constant';
import { usersCollection } from './users';
import { shuffleArray } from 'pages/dashboard/utils';
import { bugsnagErrorHandler } from 'utils';
import CONSTANTS from 'constants/constant';
import { getActiveWords } from 'database/default';

export const getWordCollectionRef = (uid: string) => {
  return collection(shabadavaliDB, ALL_CONSTANT.USERS, uid, ALL_CONSTANT.WORDS);
};

export const getBatch = () => {
  return writeBatch(shabadavaliDB);
};

export const commitBatch = async (batch: WriteBatch) => {
  try {
    await batch.commit();
  } catch (error) {
    bugsnagErrorHandler(error, 'database/shabadavalidb/words.ts/commitBatch', batch);
  }
};

export const addWordsToSubCollection = async (uid: string, data: WordShabadavaliDB) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    await addDoc(wordsCollectionRef, data);
  } catch (error) {
    bugsnagErrorHandler(error, 'database/shabadavalidb/words.ts/addWordsToSubCollection', data);
  }
};

export const getWords = async (uid: string, isLearnt: boolean) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const q = query(
      wordsCollectionRef,
      where('isLearnt', '==', isLearnt),
      where('isWordRead', '==', true),
      limit(CONSTANTS.GET_WORD_LIMIT),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    }
    const documents = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    const shuffledDocuments = shuffleArray(documents);
    return shuffledDocuments;
  } catch (error) {
    bugsnagErrorHandler(error, 'database/shabadavalidb/words.ts/getWords', {
      isLearnt: isLearnt,
    });
    return [];
  }
};

export const addQuestionsBatch = (
  uid: string,
  wordToQuestionIdsMap: Map<string, WordQuestionMap>,
  batch: WriteBatch,
) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    wordToQuestionIdsMap.forEach((data, wordId) => {
      const documentRef = doc(wordsCollectionRef, wordId);
      batch.update(documentRef, {
        isLearnt: data.progress >= CONSTANTS.DEFAULT_FOUR,
        progress: data.progress,
        questionIds: arrayUnion(...data.questionIds),
      });
    });
  } catch (error) {
    bugsnagErrorHandler(
      error,
      'database/shabadavalidb/words.ts/addQuestionBatch',
      addQuestionsBatch,
    );
  }
};

export const addWordsBatch = async (uid: string, words: WordShabadavaliDB[], batch: WriteBatch) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const wordIds = [];
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
          progress: wordData.progress,
          isLearnt: wordData.progress >= CONSTANTS.DEFAULT_FOUR,
        });
      }
    }
    const userDocRef = doc(usersCollection, uid);
    batch.update(userDocRef, {
      wordIds: arrayUnion(...wordIds),
    });
  } catch (error) {
    bugsnagErrorHandler(error, 'database/shabadavalidb/words.ts/addWordsBatch', words);
  }
};

export const updateUserWithWords = async (uid: string, updateData: ProgressData) => {
  const userRef = doc(usersCollection, uid);
  const batch = writeBatch(shabadavaliDB);
  batch.update(userRef, {
    ...updateData,
  });
  try {
    await batch.commit();
  } catch (error) {
    bugsnagErrorHandler(error, 'updateUserWithWords', { uid, updateData });
  }
};

export const checkIfWordPresent = async (uid: string, wordID: string) => {
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
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const docRef = doc(wordsCollectionRef, wordID);
    await updateDoc(docRef, { isWordRead: true });
  } catch (error) {
    bugsnagErrorHandler(error, 'updateWordRead', { uid });
  }
};

export const getNewWords = async (uid: string, count: number) => {
  try {
    const wordsCollectionRef = getWordCollectionRef(uid);
    const queryRef = query(wordsCollectionRef, where('isWordRead', '==', false), limit(count));
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
    return shabadavaliWordData;
  } catch (error) {
    bugsnagErrorHandler(error, 'getNewWords', { uid });
    return null;
  }
};

export const checkIfWordCollectionExists = async (uid: string) => {
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
