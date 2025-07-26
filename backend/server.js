import './config.js';

import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database.js';
import lessonRoutes from './routes/lessonRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

// =============================================================================
// DIAGNOSTIC CORS CONFIGURATION
// This allows requests from ANY origin.
// =============================================================================
app.use(cors({
  origin: '*'
}));
// =============================================================================

app.use(express.json());

connectToDatabase();

app.use('/api/lessons', lessonRoutes);

app.listen(port, () => {
  console.log(`Linguaverse server operational on port ${port}`);
});




