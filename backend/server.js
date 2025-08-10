/**
 * =============================================================================
 * LINGUAVERSE - SERVER ENTRYPOINT (FINALIZED)
 * =============================================================================
 * File: /backend/server.js
 * * Update: Corrected a race condition by ensuring the database connects
 * * BEFORE the server starts listening for requests.
 * * Update 2: Integrated the new 'speechRoutes' for audio analysis.
 * * Update 3: Integrated the new 'writingRoutes' for the Writing module.
 * * Update 4: Integrated the new 'ttsRoutes' for the Listening module.
 * * Update 5: Integrated the new 'feedbackRoutes' for the Feedback system.
 * =============================================================================
 */

import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database.js';
import lessonRoutes from './routes/lessonRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import phoneticsRoutes from './routes/phoneticsRoutes.js';
import speechRoutes from './routes/speechRoutes.js';
import writingRoutes from './routes/writingRoutes.js';
import ttsRoutes from './routes/ttsRoutes.js';
// --- FEEDBACK MODULE ---
import feedbackRoutes from './routes/feedbackRoutes.js';
// --- END ---

const startServer = async () => {
  try {
    await connectToDatabase();

    const app = express();
    const port = process.env.PORT || 3001;

    const frontendURL = 'https://probable-dollop-779x77grw79cxqvv-5173.app.github.dev';
    const corsOptions = {
      origin: frontendURL,
      optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
    app.use(express.json());

    // Routes are only set up after the database is ready.
    app.use('/api/portfolio', portfolioRoutes);
    app.use('/api/lessons', lessonRoutes);
    app.use('/api/phonetics', phoneticsRoutes);
    app.use('/api/speech', speechRoutes);
    app.use('/api/writing', writingRoutes);
    app.use('/api/tts', ttsRoutes);
    // --- FEEDBACK MODULE ---
    app.use('/api/feedback', feedbackRoutes);
    // --- END ---

    app.listen(port, () => {
      console.log(`Linguaverse server operational on port ${port}`);
    });

  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
