// File: backend/routes/writingRoutes.js

import express from 'express';
// --- We now import both functions ---
import { generateWritingAssignment, getWritingFeedback } from '../services/writingService.js';

const router = express.Router();

// POST /api/writing/generate
router.post('/generate', async (req, res) => {
  const { title, situation } = req.body;
  if (!title || !situation) {
    return res.status(400).json({ message: 'Lesson title and situation are required.' });
  }
  try {
    const assignment = await generateWritingAssignment(title, situation);
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate writing assignment.' });
  }
});

// --- NEW ROUTE FOR FEEDBACK ---
// POST /api/writing/feedback
router.post('/feedback', async (req, res) => {
    const { prompt, userWriting } = req.body;
    if (!prompt || !userWriting) {
        return res.status(400).json({ message: 'Prompt and user writing are required.' });
    }
    try {
        const feedback = await getWritingFeedback(prompt, userWriting);
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate writing feedback.' });
    }
});
// --- END NEW ROUTE ---

export default router;