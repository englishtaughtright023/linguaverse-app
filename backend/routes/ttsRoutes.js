// File: backend/routes/ttsRoutes.js

import express from 'express';
import { generateDialogueAudio } from '../services/ttsService.js';

const router = express.Router();

// POST /api/tts/generate
router.post('/generate', async (req, res) => {
  const { dialogue, voice = 'alloy' } = req.body; // Default to 'alloy' voice

  if (!dialogue || !Array.isArray(dialogue) || dialogue.length === 0) {
    return res.status(400).json({ message: 'A valid dialogue array is required.' });
  }

  try {
    const audioBuffer = await generateDialogueAudio(dialogue, voice);
    
    // Set the proper headers to send an audio file
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);

  } catch (error) {
    res.status(500).json({ message: 'Failed to generate audio.' });
  }
});

export default router;