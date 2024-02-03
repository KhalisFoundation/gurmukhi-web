require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const functions = require('firebase-functions');
const { createWriteStream, readFileSync } = require('fs');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.NARAKEET_TTS_API_KEY;

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
  
      await new Promise((resolve, reject) => {
        const writeStream = createWriteStream('result.mp3');
        response.data.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        console.log('Audio file generated successfully.');
      });
  
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  }

app.post('/generate-audio', async (req, res) => {
  try {
    await generateAudioWithAxios(req.body.text, req.body.voice);

    // Read audio file as base64
    const audio = readFileSync('result.mp3', { encoding: 'base64' });

    // Send response with the audio data
    res.json({
      message: 'Audio file generated successfully.',
      audio: audio,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

exports.api = functions.https.onRequest(app);
