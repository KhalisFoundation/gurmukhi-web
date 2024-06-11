const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, query, getDocs, where } = require('firebase-admin/firestore');

const serviceAccount = require('../gurmukhi-dev-firebase-adminsdk.json');

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'gurmukhi-dev',
});

// const db = getFirestore();
const shabadavaliDB = getFirestore('shabadavali');

async function updateIsReadForAllUsers() {
  // Fetch all user documents
  const usersSnapshot = await shabadavaliDB.collection('users').get();

  let documentsUpdated = 0;
  if (usersSnapshot.empty) {
    console.log('No users found.');
    return;
  }

  console.log(`Found ${usersSnapshot.docs.length} users. Updating documents...`);

  // Iterate over each user and update their 'words' documents
  const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
    const wordsCollectionRef = shabadavaliDB
      .collection('users')
      .doc(userDoc.id)
      .collection('words');
    const querySnapshot = await wordsCollectionRef.where('isWordRead', '==', false).get();

    if (querySnapshot.empty) {
      // console.log(`No words to update for user ${userDoc.id}.`);
      return;
    }
    console.log(`User ${userDoc.id}- ${querySnapshot.docs.length}`);
    documentsUpdated += 1;
    return Promise.all(querySnapshot.docs.map((doc) => doc.ref.update({ isWordRead: true })));
  });

  // Wait for all user updates to complete
  await Promise.all(updatePromises);
  console.log('total Documents Updated', documentsUpdated);
  console.log('All documents updated successfully across all users.');
}

updateIsReadForAllUsers().catch(console.error);
