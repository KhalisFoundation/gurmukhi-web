const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const projectId = 'gurmukhi-dev';
const serviceAccount = require(`./${projectId}.json`);

initializeApp({
  credential: cert(serviceAccount),
  projectId,
});

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
        const user = userDoc.data();
        const userDocRef = shabadavaliDB.collection('users').doc(userDoc.id);
        const wordCollection = userDocRef.collection('words');
        const wordsSnapshot = await wordCollection.get();
        if (!wordsSnapshot.empty) {
            wordsSnapshot.docs.forEach(async (wordDoc) => {
                console.log(`Deleting word ${wordDoc.id} from user ${user.uid}`);
                await wordCollection.doc(wordDoc.id).delete();
            });
        } else {
            console.log(`No words found for user ${user.uid}`);
        }

        console.log(`Updating document with ${user.uid ?? null}`);
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
