// File: backend/models/Lesson.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const VocabularyItemSchema = new Schema({
  word: { type: String, required: true },
  translation: { type: String, required: true },
  explanation: { type: String, required: true }
});

const GrammarPointSchema = new Schema({
  point: { type: String, required: true },
  explanation: { type: String, required: true },
  example: { type: String, required: true }
});

const DialogueLineSchema = new Schema({
  speaker: { type: String, required: true },
  sentence: { type: String, required: true }
});

// --- NEW: Schema for feedback ---
const FeedbackSchema = new Schema({
    good: { type: Number, default: 0 },
    bad: { type: Number, default: 0 },
    reasons: [{
        type: String, // e.g., 'picture', 'writing'
        enum: ['picture', 'writing', 'listening', 'speaking']
    }]
});
// --- END ---

const lessonSchema = new Schema({
  topic: { type: String, required: true },
  modelUsed: { type: String },
  promptUsed: { type: String },
  heroImageUrl: { type: String, required: true },
  chapterImageUrl: { type: String },
  title: { type: String, required: true },
  situation: { type: String, required: true },
  vocabulary: [VocabularyItemSchema],
  grammar: [GrammarPointSchema],
  dialogue: {
    type: [DialogueLineSchema],
    validate: [
      { validator: (val) => val.length > 0, msg: 'Dialogue array cannot be empty.' }
    ],
    required: true
  },
  // --- NEW: Add feedback to the main schema ---
  feedback: { type: FeedbackSchema, default: () => ({}) },
  // --- END ---
  createdAt: { type: Date, default: Date.now }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;