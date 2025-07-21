import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.options('/api/generate', cors()); 

app.use(express.json());

app.post('/api/generate', cors(), async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { topic, proficiency } = req.body;

    if (!topic || !proficiency) {
      return res.status(400).json({ error: 'Topic and proficiency are required.' });
    }

    const prompt = `Create a short language lesson about "${topic}" for a user with "${proficiency}" proficiency. Include a brief explanation, 3-5 key vocabulary words with definitions, and one simple grammar rule with an example. Format the response as a JSON object with keys: "explanation", "vocabulary", and "grammar". The "vocabulary" value should be an array of objects, each with "word" and "definition" keys. The "grammar" value should be an object with "rule" and "example" keys.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // --- START: New logic to clean the AI's response ---
    let text = response.text();
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1) {
      text = text.substring(startIndex, endIndex + 1);
    }
    // --- END: New logic ---

    try {
      const lessonJson = JSON.parse(text);
      res.json(lessonJson);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      res.status(500).json({ error: 'Failed to parse the lesson format from the AI response.' });
    }

  } catch (error) {
    console.error('--- DETAILED AI GENERATION ERROR ---');
    console.error('Error Message:', error.message);
    res.status(500).json({ error: 'Failed to generate lesson from AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});