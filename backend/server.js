import './config.js';

// STEP 2: Now we can import other modules that rely on .env variables.
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database.js';
import lessonRoutes from './routes/lessonRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

const frontendURL = 'https://probable-dollop-779x77grw79cxqvv-5173.app.github.dev';
const corsOptions = {
  origin: frontendURL,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// This function call will now succeed because connectToDatabase()
// can see process.env.MONGO_URI.
connectToDatabase();

app.use('/api/lessons', lessonRoutes);

app.listen(port, () => {
  console.log(`Linguaverse server operational on port ${port}`);
});
