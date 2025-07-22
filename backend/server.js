import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- OpenAI Client Initialization ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- MongoDB Connection Logic ---
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not found in .env file. Server cannot start.");
  process.exit(1);
}
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let lessonsCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
    const database = client.db("linguaverse");
    lessonsCollection = database.collection("lessons");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}
connectToDatabase();

// --- API Endpoints ---

// GET all saved lessons from the database
app.get('/api/lessons', async (req, res) => {
  if (!lessonsCollection) return res.status(503).json({ error: 'Database not connected.' });
  try {
    const lessons = await lessonsCollection.find({}).sort({ savedAt: -1 }).toArray(); // Sort by most recent
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve lessons.' });
  }
});

// POST a new lesson to save to the database
app.post('/api/lessons', async (req, res) => {
  if (!lessonsCollection) return res.status(503).json({ error: 'Database not connected.' });
  try {
    const lessonData = req.body;
    const lessonToSave = {
      ...lessonData,
      savedAt: new Date() // Add a timestamp when saving
    };
    const result = await lessonsCollection.insertOne(lessonToSave);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save lesson.' });
  }
});

// POST to generate a new lesson from the AI
app.post('/api/generate', async (req, res) => {
  try {
    const { topic, proficiency } = req.body;
    if (!topic || !proficiency) {
      return res.status(400).json({ error: 'Topic and proficiency are required.' });
    }

    const prompt = `Create a short language lesson about "${topic}" for a user with "${proficiency}" proficiency. You MUST respond with only a valid JSON object. Do not include any markdown formatting or other text. The JSON object must have keys: "explanation", "vocabulary", and "grammar". The "vocabulary" value must be an array of objects, each with "word" and "definition" keys. The "grammar" value must be an object with "rule" and "example" keys.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    const lessonJson = JSON.parse(text); 
    res.json(lessonJson);

  } catch (error) {
    console.error('--- AI GENERATION ERROR ---', error);
    res.status(500).json({ error: 'Failed to generate lesson from AI.' });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});