const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const projectId = 'gurmukhi-dev';
const serviceAccount = require(`./${projectId}.json`);

initializeApp({
  credential: cert(serviceAccount),
  projectId,
});

const auth = getAuth();
const shabadavaliDB = getFirestore('shabadavali');

async function migrateExistingGoogleUsers() {
    const usersSnapshot = await shabadavaliDB.collection('users').get();
    
    let documentsUpdated = [];
    let documentsSkipped = 0;
    if (usersSnapshot.empty) {
        console.log('No users found.');
        return;
    }
    
    console.log(`Found ${usersSnapshot.docs.length} users. Updating documents...`);
    const batch = shabadavaliDB.batch();
    const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
        const data = userDoc.data();
        const userDocRef = shabadavaliDB.collection('users').doc(userDoc.id);
    
        if (!data.emailVerified && !data.lastLoginAt && !data.uid) {
            const userRecord = await auth.getUser(userDoc.id);
            console.log(`Updating document ${userDoc.uid ?? null} which has emailVerified: ${userDoc.emailVerified  ?? null} and lastLoginAt: ${userDoc.lastLoginAt ?? null}...`);
            const updatedData = {
                emailVerified: userRecord.emailVerified || false,
                lastLoginAt: userRecord.metadata.lastSignInTime || data.created_at,
                uid: userRecord.uid,
            };
            console.log(updatedData);
            batch.set(userDocRef, updatedData, { merge: true });
            documentsUpdated.push(userDoc.id);
        } else {
            console.log(`Skipping document ${userDoc.id}...`);
            documentsSkipped++;
        }
    });
    await Promise.all(updatePromises);
    await batch.commit();
    
    console.log(`Updated ${documentsUpdated} documents.`);
    console.log(`Skipped ${documentsSkipped} documents.`);
};

migrateExistingGoogleUsers();
