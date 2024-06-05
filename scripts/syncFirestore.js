const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('../gurmukhi-dev-firebase-adminsdk.json');

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'gurmukhi-dev',
});

const db = getFirestore();

// emulatorAdmin.initializeApp(
//   {
//     projectId: 'gurmukhi-local',
//   },
//   'emulator',
// );

// Point to the running Firestore emulator
// emulatorAdmin.firestore().settings({
//   host: '127.0.0.1:8080',
//   ssl: false,
// });

// const emulatorDb = emulatorAdmin.firestore();

// List all Document Ids success
// No as such limit.
// It doesn't fetch the documents
// limitation doesn't filter the data
async function fetchDocumentIds() {
  try {
    const collectionRef = db.collection('words');
    const snapshot = await collectionRef.listDocuments();
    if (snapshot.empty) {
      console.log("it's empty");
    }
    snapshot.forEach((doc) => {
      console.log(doc.id);
      // console.log(doc.id, '=>', doc.data());
    });
    // const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
}
// fetchDocumentIds();

//list all Documents where status = 'Active'
//limit upto 1000 documents
//
async function statusActive() {
  try {
    const collectionRef = db.collection('words').where('status', '==', 'active');
    const shabadavaliWordRef = listDocuments(shabadavaliWords);
    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
      console.log("it's empty");
    }
    snapshot.forEach((doc) => {
      console.log(doc.id);
      // console.log(doc.id, '=>', doc.data());
    });
    // const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
}
// statusActive();

async function storeWordIds() {}
storeWordIds();
/* 
1 Get all the word Ids-> Limit/time
2. Store all the word Ids-> limit/time
3. Get word Ids with status Active-> limit/time
4. Need word Name
5. Get UsedWords-> Scenario
5. Store the object. 
6. Get Next/new word where isRead=false
7. When words are completed 
8. Do we need to run script/implement in code?
*/

//6. Get Next/new word where isRead=false
async function getNewWord() {
  //make sure previous words have isRead true
  const collectionRef = db
    .collection('shabadavali/users/id/words')
    .where('isRead', '==', 'false')
    .limit(1);

  const wordIDsData = await collectionRef.get();
  const getWord = await getDataByID(wordId, wordCollection, 'word_id');
  const sentences = await getDataByID(wordId, sentecesCollection, 'word_id', limit);
  await markIsWordRead(true);
  const { synonyms, antonyms } = await getSemanticsByIds(randomWord.synonyms, randomWord.antonyms);
}
getNewWord();
