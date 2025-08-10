// File: backend/routes/feedbackRoutes.js

import express from 'express';
import Lesson from '../models/Lesson.js';

const router = express.Router();

// POST /api/feedback/rate
router.post('/rate', async (req, res) => {
  const { lessonId, rating, reason } = req.body;

  if (!lessonId || !rating) {
    return res.status(400).json({ message: 'Lesson ID and rating are required.' });
  }
  if (rating !== 'good' && rating !== 'bad') {
    return res.status(400).json({ message: 'Invalid rating value.' });
  }

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    // Increment the good/bad counter
    lesson.feedback[rating] += 1;

    // If a reason is provided for a bad rating, add it to the array
    if (rating === 'bad' && reason) {
      lesson.feedback.reasons.push(reason);
    }

    await lesson.save();
    res.status(200).json({ message: 'Feedback recorded successfully.' });

  } catch (error) {
    console.error('[Feedback Route Error]:', error);
    res.status(500).json({ message: 'Failed to record feedback.' });
  }
});

export default router;