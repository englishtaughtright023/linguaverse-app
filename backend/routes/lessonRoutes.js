import express from 'express';
import { generateFullLesson } from '../services/lessonService.js';
import Lesson from '../models/Lesson.js'; // Ensure this model import is correct

const router = express.Router();

// GET /api/lessons - Fetches all lesson summaries
router.get('/', async (req, res) => {
  try {
    // We only select a few fields for the list to keep the payload small
    const lessons = await Lesson.find({}).sort({ createdAt: -1 }).select('_id title topic heroImageUrl modelUsed');
    res.json(lessons);
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    res.status(500).json({ message: 'Error fetching lessons from the database.' });
  }
});

// --- THIS IS THE NEW ROUTE THAT FIXES THE 404 ERROR ---
// GET /api/lessons/:id - Fetches a single, complete lesson by its ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }
    res.json(lesson);
  } catch (error) {
    console.error(`Failed to fetch lesson with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching lesson from the database.' });
  }
});
// --- END NEW ROUTE ---

// POST /api/lessons - Creates a new lesson
router.post('/', async (req, res) => {
  try {
    const newLessonData = await generateFullLesson(req.body);
    const lesson = new Lesson(newLessonData);
    await lesson.save();
    res.status(201).json(lesson);

  } catch (error) {
    console.error('Error in lesson creation route:', error);
    res.status(500).json({ message: 'Failed to create new lesson.', error: error.message });
  }
});

export default router;