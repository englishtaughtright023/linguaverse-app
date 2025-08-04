/**
 * =============================================================================
 * LINGUAVERSE - SERVER ENTRYPOINT (REPAIRED)
 * =============================================================================
 * File: /backend/server.js
 * * Update: This server file now correctly imports and uses the new
 * 'portfolioRoutes' to serve model data to the frontend.
 * =============================================================================
 */

import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database.js';
import lessonRoutes from './routes/lessonRoutes.js';
// --- THIS IS THE REPAIR ---
// 1. Import the new portfolio routes.
import portfolioRoutes from './routes/portfolioRoutes.js';
// --- END REPAIR ---

const app = express();
const port = process.env.PORT || 3001;

const frontendURL = 'https://probable-dollop-779x77grw79cxqvv-5173.app.github.dev';
const corsOptions = {
  origin: frontendURL,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

connectToDatabase();

// --- THIS IS THE REPAIR ---
// 2. Use the new routes. This makes the '/api/portfolio/models' endpoint active.
app.use('/api/portfolio', portfolioRoutes);
// --- END REPAIR ---
app.use('/api/lessons', lessonRoutes);

app.listen(port, () => {
  console.log(`Linguaverse server operational on port ${port}`);
});
