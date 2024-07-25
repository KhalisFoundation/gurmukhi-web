const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const projectId = 'gurmukhi-5f8f5';
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
        let dateIsNotTimestamp = false;
        if ((data.created_at && typeof data.created_at === 'string') || data.created_at === undefined) {
            dateIsNotTimestamp = true;
        }
        if ((data.lastLoginAt && typeof data.lastLoginAt === 'string') || data.lastLoginAt === undefined) {
            dateIsNotTimestamp = true;
        }
    
        if (!data.uid || data.emailVerified === undefined || dateIsNotTimestamp) {
            const userRecord = await auth.getUser(userDoc.id);
            const createdAt = Timestamp.fromDate(new Date(userRecord.metadata.creationTime));
            const lastLoginAt = Timestamp.fromDate(new Date(userRecord.metadata.lastSignInTime));
            console.log(`Updating document ${data.uid ?? null} which has emailVerified: ${data.emailVerified  ?? null}, lastLoginAt: ${JSON.stringify(lastLoginAt) ?? null} and created_at: ${JSON.stringify(createdAt)}...`);
            const updatedData = {
                emailVerified: userRecord.emailVerified || false,
                created_at: createdAt || data.created_at,
                lastLoginAt: lastLoginAt || data.created_at,
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
