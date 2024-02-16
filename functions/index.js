require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const functions = require('firebase-functions');
const { Readable } = require('stream');

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { getFirestore, FieldPath } = require('firebase-admin/firestore');

const projectId = process.env.PROJECT_ID;
const API_KEY = process.env.NARAKEET_TTS_API_KEY;

const serviceAccount = require(`./${projectId}-firebase-adminsdk.json`);

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${projectId}.appspot.com`
});

const db = getFirestore();
const storage = getStorage();
const bucket = storage.bucket();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

async function generateAudioWithAxios(text, voice = 'Diljit') {
    try {
        const response = await axios.post(
            `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
            Readable.from([text]),
            {
                headers: {
                    'accept': 'application/octet-stream',
                    'x-api-key': API_KEY,
                    'content-type': 'text/plain'
                },
                responseType: 'stream',
            }
        );

        const audioBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            response.data.on('data', (chunk) => chunks.push(chunk));
            response.data.on('end', () => resolve(Buffer.concat(chunks)));
            response.data.on('error', reject);
        });

        return audioBuffer;
    } catch (error) {
        console.error('Error generating audio:', error);
    }
}

async function updateAudioURL(textId, textType, url) {
    if (textId) {
        // save the audio url to Firestore
        const textRef = db.collection(textType).doc(textId);
        await textRef.update({
            audioURL: url,
        });
    }
}

app.post('/generate-audio', async (req, res) => {
    try {
        const textId = req.body.id;
        const text = req.body.text;
        const textName = req.body.text.replace(/[\s ]/g, '_');
        let textType = '';
        switch (req.body.type) {
            case 'word':
            case 'option':
                textType = 'words';
                break;
            case 'sentence':
                textType = 'sentences';
                break;
            case 'question':
                textType = 'questions';
                break;
        }

        let doesIdExist = false;
        if (textId) {
            const textRef = db.collection(textType);
            const queryRef = await textRef.where(FieldPath.documentId(), '==', textId).get();
            if (!queryRef.empty) {
                doesIdExist = true;
            }
        }

        if (textType !== '') {
            // Upload file to Firebase Storage
            let fileName = `${textType}/${textName}.mp3`;
            let isTextUpdated = false;
            
            // check if file already exists in firestore
            if (doesIdExist) {
                try {
                    fileName = `${textType}/${textName}-${textId}.mp3`;
                    const textRef = db.collection(textType).doc(textId);
                    const doc = await textRef.get();
                    if (doc.exists) {
                        const data = doc.data();
                        if (data.audioURL) {
                            // check if text is exactly the same as part of url
                            const decodedFileName = decodeURIComponent(data.audioURL.split('/')[5].split('.mp3')[0]);
                            let decodedString = '';
                            let audioFileId = '';
                            if (decodedFileName.includes('-')) {
                                [decodedString, audioFileId] = decodedFileName.split('-');
                            } else {
                                decodedString = decodedFileName;
                            }
                            if (decodedString === textName) {
                                const cleanURL = data.audioURL.split('?')[0];
                                res.json({
                                    message: 'Audio URL fetched from Firestore.',
                                    status: 200,
                                    audio: cleanURL,
                                });
                                return;
                            } else {
                                if (textId === audioFileId) {
                                    // delete the old file
                                    const oldFile = bucket.file(`${textType}/${decodedFileName}.mp3`);
                                    const [oldExists] = await oldFile.exists();
                                    if (oldExists) {
                                        await oldFile.delete();
                                        isTextUpdated = true;
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Document doesn't exist with the provided ID.");
                    console.error(error);
                    res.status(500).send('Internal Server Error');
                }
            }

            // check if file already exists in storage
            const file = bucket.file(fileName);

            // check if file already exists in storage
            const [exists] = await file.exists();
            if (exists) {
                // get file url from storage
                file.get
                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491',
                });

                const cleanURL = url.split('?')[0];
                if (doesIdExist) {
                    await updateAudioURL(textId, textType, cleanURL);
                }
                res.json({
                    message: 'Audio file already exists in Firebase Storage.',
                    status: 200,
                    audio: cleanURL,
                });
                return;
            }

            const audioBuffer = await generateAudioWithAxios(text, req.body.voice);

            await file.save(audioBuffer, {
                contentType: 'audio/mp3',
                gzip: true,
            });

            // get the audio url from storage
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            });

            let responseMessage = `${
                isTextUpdated && 'Text was updated, '
            } Audio file generated successfully, saved in Firestore and Storage.`;
            const cleanURL = url.split('?')[0];
            if (doesIdExist) {
                await updateAudioURL(textId, textType, cleanURL);
            }
            res.json({
                message: responseMessage,
                status: 200,
                audio: cleanURL,
            });
        } else {
            res.status(400).json({
                message: 'Invalid request type.',
                status: 400,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

exports.api = functions.https.onRequest(app);
