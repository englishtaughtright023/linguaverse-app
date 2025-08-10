// File: backend/services/ttsService.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates an audio file from dialogue text using a specified voice.
 * @param {Array<object>} dialogue - The dialogue array from the lesson.
 * @param {string} voice - The selected voice (e.g., 'alloy', 'nova').
 * @returns {Promise<Buffer>} A promise that resolves to the audio data buffer.
 */
export async function generateDialogueAudio(dialogue, voice) {
  // Format the dialogue array into a single string for the AI.
  const dialogueText = dialogue.map(line => `${line.speaker}: ${line.sentence}`).join('\n');
  console.log(`[TTS Service]: Generating audio for voice: ${voice}`);

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: dialogueText,
    });

    // The response is a stream; we convert it to a buffer.
    const buffer = Buffer.from(await mp3.arrayBuffer());
    console.log(`[TTS Service]: Audio generated successfully.`);
    return buffer;

  } catch (error) {
    console.error('[TTS Service]: Error generating audio from OpenAI:', error);
    throw new Error('Failed to generate dialogue audio.');
  }
}