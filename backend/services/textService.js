import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from your .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates the main, structured lesson text by calling the OpenAI API.
 * @param {string} topic - The user-selected topic.
 * @param {string} proficiency - The user's proficiency level.
 * @returns {object} A structured JSON object containing the lesson text.
 */
export async function generateLessonText(topic, proficiency = 'Intermediate') {
  console.log(`Generating LIVE lesson text via OpenAI for topic: "${topic}"`);

  // The prompt structure is slightly different for OpenAI
  const systemPrompt = `You are an expert language teacher and a creative writer. Your task is to create a cohesive, multi-part language lesson. You must respond with a single, valid JSON object and nothing else.`;

  const userPrompt = `
    Create a lesson for an ${proficiency} English learner on the topic: "${topic}".
    The JSON object must have the following structure:
    - "title": A creative and engaging title.
    - "situation": A one-paragraph, first-person explanation ("Your Situation: ...").
    - "vocabulary": An array of 5 objects, each with "word" and "translation" keys.
    - "grammar": An object with "rule" and "example" keys.
    - "dialogue": An array of 3-4 objects, each with "speaker" and "line" keys.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the specified model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }, // Instruct OpenAI to return valid JSON
    });

    const jsonString = response.choices[0].message.content;
    
    console.log("OpenAI Response received, parsing JSON...");
    const lessonData = JSON.parse(jsonString);
    
    return lessonData;

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to generate lesson text from OpenAI service.");
  }
}