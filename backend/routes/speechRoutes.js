// File: backend/routes/speechRoutes.js

import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../services/speechService.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// POST /api/speech/analyze
router.post('/analyze', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file received.' });
  }

  try {
    console.log(`[Speech Service]: Received audio file of size ${req.file.size} bytes.`);
    
    // --- THIS IS THE UPGRADE ---
    // We now send the audio buffer to our new transcription service.
    const transcription = await transcribeAudio(req.file.buffer);
    
    // We return the actual transcription text.
    res.json({ transcription });
    // --- END UPGRADE ---

  } catch (error) {
    res.status(500).json({ message: 'Failed to analyze speech.' });
  }
});

export default router;