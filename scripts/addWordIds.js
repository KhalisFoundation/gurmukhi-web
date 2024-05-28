const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, query, getDocs, where } = require('firebase-admin/firestore');

const serviceAccount = require('../gurmukhi-dev-firebase-adminsdk.json');

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'gurmukhi-dev',
});

const db = getFirestore();
const shabadavaliDB = getFirestore('shabadavali');

async function addWordsForAllUsers() {
  const batch = shabadavaliDB.batch();
  // Fetch all user documents
  const usersSnapshot = await shabadavaliDB.collection('users').get();

  let documentsUpdated = 0;
  if (usersSnapshot.empty) {
    console.log('No users found.');
    return;
  }

  // console.log(`Found ${usersSnapshot.docs.length} users. Updating documents...`);
  const wordsDBCollectionRef = db.collection('words');
  const querySnapshot = await wordsDBCollectionRef.where('status', '==', 'active').get();
  if (querySnapshot.empty) {
    console.log('wordsDB is empty');
    return;
  }
  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  console.log('total Words', data.length);

  // Iterate over each user and update their 'words' documents
  const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
    const shabadavaliWordsRef = shabadavaliDB
      .collection('users')
      .doc(userDoc.id)
      .collection('words');
    const wordsCollectionResult = await shabadavaliWordsRef.get();

    if (wordsCollectionResult.empty) {
      // console.log(`No words to update for user ${userDoc.id}.`);
      return;
    }
    const wordCollectionData = wordsCollectionResult.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const filteredData = data.filter((dataItem) => {
      return !wordCollectionData.some((wordItem) => wordItem.id === dataItem.id);
    });

    for (const item of filteredData) {
      const wordRef = shabadavaliWordsRef.doc(item.id);
      batch.set(wordRef, {
        word_id: item.id,
        word: item.word,
        image: item.images[0],
        isLearnt: false,
        isWordRead: false,
        lastReviewed: null,
        progress: 0,
        questionIds: [],
      });
    }

    console.log(`User ${userDoc.id}- ${wordCollectionData.length}-${filteredData.length}`);

    documentsUpdated += 1;
  });

  // // Wait for all user updates to complete

  await Promise.all(updatePromises);
  await batch.commit();
  // console.log('total Documents Updated', batch);
  console.log('All documents updated successfully across all users.');
}

addWordsForAllUsers().catch(console.error);
