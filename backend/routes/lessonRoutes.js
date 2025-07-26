// -----------------------------------------------------------------------------
// FILE: backend/routes/lessonRoutes.js (CORRECTED)
// -----------------------------------------------------------------------------
import express from 'express';
import { getDb } from '../database.js';
import { generateFullLesson } from '../services/lessonService.js';

const router = express.Router();

// =============================================================================
// CORRECTION: Added GET / route to fetch all lessons for the gallery.
// =============================================================================
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    // Find all documents in the 'lessons' collection
    const lessons = await db.collection('lessons')
      .find({})
      .sort({ _id: -1 }) // Sort by newest first
      .toArray();
    res.status(200).json(lessons);
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    res.status(500).json({ error: 'Failed to retrieve lessons from the database.' });
  }
});

// POST /api/lessons/generate
// The primary endpoint for creating a new lesson.
router.post('/generate', async (req, res) => {
  try {
    const { topic, proficiency } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is a required field.' });
    }

    console.log(`Received request to generate lesson for topic: ${topic}`);
    
    // 1. Call the lessonService to generate the full lesson package.
    const newLesson = await generateFullLesson(topic, proficiency);

    // 2. Save the newly generated lesson to the database.
    const db = getDb();
    const lessonsCollection = db.collection('lessons');
    const result = await lessonsCollection.insertOne(newLesson);

    console.log(`Lesson saved to database with ID: ${result.insertedId}`);

    // 3. Return the full lesson object (with its new DB ID) to the user.
    res.status(201).json({ ...newLesson, _id: result.insertedId });

  } catch (error) {
    console.error('Error in lesson generation route:', error);
    res.status(500).json({ error: 'Failed to generate lesson due to an internal server error.' });
  }
});

// We will implement this endpoint in a later phase.
// POST /api/lessons/:id/regenerate-image
router.post('/:id/regenerate-image', async (req, res) => {
  const { id } = req.params;
  res.status(501).json({ message: `Endpoint not yet implemented. Received lesson ID: ${id}` });
});

export default router;
