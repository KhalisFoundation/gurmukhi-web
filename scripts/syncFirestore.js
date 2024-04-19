const admin = require('firebase-admin');

const serviceAccount = require('../gurmukhi-dev-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gurmukhi-dev',
});

const db = admin.firestore();

const emulatorAdmin = require('firebase-admin');
emulatorAdmin.initializeApp(
  {
    projectId: 'gurmukhi-local',
  },
  'emulator',
);

// Point to the running Firestore emulator
emulatorAdmin.firestore().settings({
  host: 'localhost:8080',
  ssl: false,
});

const emulatorDb = emulatorAdmin.firestore();

async function copyCollections() {
  const collections = await db.listCollections();
  console.log(collections);
  for (let collection of collections) {
    const documents = await collection.listDocuments();
    documents.forEach(async (doc) => {
      const docData = await doc.get();
      const data = docData.data();
      if (data) {
        try {
          await emulatorDb.collection(collection.id).doc(doc.id).set(data);
          console.log(`Document ${doc.id} copied to ${collection.id}`);
        } catch (error) {
          console.error(`Error writing document ${doc.id}: ${error}`);
        }
      }
    });
  }
}

copyCollections();
