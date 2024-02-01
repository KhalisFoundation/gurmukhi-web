```
This is the main file of backend server which faciliates the conversion of text to speech using Narakeet API.
It is a simple express server which accepts a POST request with text and voice as body parameters.
It is currently hosted on Heroku for testing purposes, and we need to host it on a more reliable server for production.
```

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Readable } = require('stream');
const axios = require('axios');
const { createWriteStream, readFileSync } = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.NARAKEET_TTS_API_KEY;
app.use(cors());

app.use(express.json());

async function generateAudioWithAxios(text, voice = 'Diljit') {
    try {
      const response = await axios.post(
        `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
        Readable.from([text]),
        {
            'accept': 'application/octet-stream',
          headers: {
            'x-api-key': API_KEY,
            'content-type': 'text/plain'
          },
          responseType: 'stream',
        }
      );
  
      response.data.pipe(writeStream);
      await new Promise((resolve, reject) => {
        const writeStream = createWriteStream('result.mp3');
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
    const response = await generateAudioWithAxios(req.body.text, req.body.voice);

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
