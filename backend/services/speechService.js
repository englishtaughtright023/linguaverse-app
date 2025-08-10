// File: backend/services/speechService.js

import OpenAI from 'openai';
import { Readable } from 'stream';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribes an audio buffer using the OpenAI Whisper API.
 * @param {Buffer} audioBuffer The audio data captured from the user.
 * @returns {Promise<string>} The transcribed text.
 */
export async function transcribeAudio(audioBuffer) {
  console.log('[Speech Service]: Transcribing audio with OpenAI Whisper...');

  try {
    // Convert buffer to a readable stream, which the API expects.
    const readableStream = Readable.from(audioBuffer);
    
    // The OpenAI SDK requires a file name, even if the data is from a stream.
    readableStream.path = 'audio.webm';

    const response = await openai.audio.transcriptions.create({
      file: readableStream,
      model: 'whisper-1',
    });

    console.log(`[Speech Service]: Transcription successful: "${response.text}"`);
    return response.text;
  } catch (error) {
    console.error('[Speech Service]: Error during transcription:', error);
    // Return an empty string on failure so the game can continue.
    return ''; 
  }
}