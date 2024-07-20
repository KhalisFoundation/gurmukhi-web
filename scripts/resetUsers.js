const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, query, getDocs, where } = require('firebase-admin/firestore');

const serviceAccount = require('../gurmukhi-dev.json');

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'gurmukhi-dev',
});

const db = getFirestore();
const shabadavaliDB = getFirestore('shabadavali');

async function resetUsers() {
    const usersSnapshot = await shabadavaliDB.collection('users').get();
    
    let documentsUpdated = [];
    if (usersSnapshot.empty) {
        console.log('No users found.');
        return;
    }
    
    console.log(`Found ${usersSnapshot.docs.length} users. Updating documents...`);
    const batch = shabadavaliDB.batch();
    const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
        const userDocRef = shabadavaliDB.collection('users').doc(userDoc.id);
        const wordCollection = userRef.collection('words');
        if (!wordCollection.empty) {
            const wordsSnapshot = await wordCollection.get();
            wordsSnapshot.docs.forEach(async (wordDoc) => {
                console.log(`Deleting word ${wordDoc.id} from user ${userDoc.id}`);
                await wordCollectionInUserDoc.doc(wordDoc.id).delete();
            });
        }

        console.log(`Updating document with ${userDoc.uid ?? null}`);
        const updatedData = {
            progress: {
                currentProgress: 0,
                currentLevel: 0,
                gameSession: [],
            },
            wordIds: [],
        };
        console.log(updatedData);
        batch.set(userDocRef, updatedData, { merge: true });
        documentsUpdated.push(userDoc.id);
    });
    await Promise.all(updatePromises);
    await batch.commit();
    
    console.log(`Updated ${documentsUpdated} documents.`);
};

resetUsers();
