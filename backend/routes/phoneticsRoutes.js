// File: backend/routes/phoneticsRoutes.js

import express from 'express';
import { getPhoneticBreakdown } from '../services/phoneticsService.js';

const router = express.Router();

// POST /api/phonetics
// Expects a body like: { "sentence": "The quick brown fox..." }
router.post('/', async (req, res) => {
  const { sentence } = req.body;

  if (!sentence) {
    return res.status(400).json({ message: 'A sentence is required.' });
  }

  try {
    const breakdown = await getPhoneticBreakdown(sentence);
    res.json(breakdown);
  } catch (error) {
    console.error('[Phonetics Route Error]:', error);
    res.status(500).json({ message: 'Failed to generate phonetic breakdown.' });
  }
});

export default router;