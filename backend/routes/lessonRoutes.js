/**
 * =============================================================================
 * LINGUAVERSE - LESSON ROUTES (REPAIRED)
 * =============================================================================
 * File: backend/routes/lessonRoutes.js
 * * Mission: To align with the updated lessonService, passing a single
 * 'options' object for lesson generation.
 * =============================================================================
 */
import express from 'express';
import { getDb } from '../database.js';
import { generateFullLesson } from '../services/lessonService.js';

const router = express.Router();

// GET /api/lessons - No changes needed here.
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const lessons = await db.collection('lessons')
      .find({})
      .sort({ _id: -1 })
      .toArray();
    res.status(200).json(lessons);
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    res.status(500).json({ error: 'Failed to retrieve lessons from the database.' });
  }
});

// POST /api/lessons/generate - REPAIRED
router.post('/generate', async (req, res) => {
  try {
    // --- THIS IS THE REPAIRED LOGIC ---
    // 1. Extract the request body directly. This object will become our 'options'.
    const lessonOptions = req.body;

    // 2. The 'if' check for modelId is removed. The service layer now handles
    // the logic of falling back to the Model Director if modelId is not present.
    // This simplifies the route handler.
    if (!lessonOptions.topic) {
      return res.status(400).json({ error: '"topic" is a required field.' });
    }
    
    console.log(`Received request to generate lesson with options:`, lessonOptions);
    
    // 3. Call the lessonService with the single 'lessonOptions' object.
    const newLesson = await generateFullLesson(lessonOptions);

    // 4. Save the newly generated lesson to the database.
    const db = getDb();
    const lessonsCollection = db.collection('lessons');
    const result = await lessonsCollection.insertOne(newLesson);

    console.log(`Lesson saved to database with ID: ${result.insertedId}`);

    // 5. Return the full lesson object (with its new DB ID) to the user.
    res.status(201).json({ ...newLesson, _id: result.insertedId });

  } catch (error) {
    // The service layer will now throw an error on failure, which is caught here.
    // This prevents a response from being sent before the database operation.
    console.error('Error in lesson generation route:', error.message);
    res.status(500).json({ error: 'Failed to generate lesson due to an internal server error.' });
  }
});

router.post('/:id/regenerate-image', async (req, res) => {
  const { id } = req.params;
  res.status(501).json({ message: `Endpoint not yet implemented. Received lesson ID: ${id}` });
});

export default router;
