import { Dispatch } from 'react';
import axios from 'axios';

export const generateNarakeetAudio = async (text: string, type: string, setAudioUrl: Dispatch<string>, id?: string) => {
  try {
    const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
    const requestUrl = `${BACKEND_API_URL}generate-audio`;
    const reqJson = {
      id: id ?? undefined,
      type: type,
      voice: 'Diljit',
      text: text,
    };

    const response = await axios.post(
      requestUrl,
      reqJson,
    );

    setAudioUrl(response.data.audio);
    return response;
  } catch (error) {
    console.error('Error generating audio:', error);
    // Handle errors here
  }
};
