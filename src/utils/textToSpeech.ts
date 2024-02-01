// Imports the Google Cloud client library
import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';

// Import other required libraries
import fs from 'fs';
import util from 'util';
// Creates a client
const client = new TextToSpeechClient();

export async function getAudioContent(text: string) {
  // Construct the request
  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'pa-IN', ssmlGender: 'MALE' },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' },
  };

  // Performs the text-to-speech request
  const result = await client.synthesizeSpeech(request);
  // Check if the result is an array
  if (Array.isArray(result)) {
    const [response] = result;
    if (response && response.audioContent) {
      // Write the binary audio content to a local file
      const writeFile = util.promisify(fs.writeFile);
      await writeFile('output.mp3', response.audioContent, 'binary');
      console.log('Audio content written to file: output.mp3');
      console.log('Google Audio content:', response.audioContent);
      return `data:audio/mp3;base64,${response.audioContent}`;
    }
  }
}
