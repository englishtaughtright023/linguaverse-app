// File: backend/services/textService.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateLessonText(enhancedPrompt, proficiency) {
  console.log(`Generating LIVE lesson text via OpenAI for scene: "${enhancedPrompt.substring(0, 80)}..."`);

  // --- THIS IS THE UPGRADE: The prompt now forces more creativity ---
  const systemPrompt = `
    You are an expert language teacher creating a lesson based on a highly specific and unique scene description.
    Your output MUST be a single, valid JSON object and nothing else.
    The JSON object MUST strictly adhere to the following structure. Do NOT omit any fields.

    {
      "title": "A creative, engaging title for the lesson that DIRECTLY relates to the unique scene provided.",
      "situation": "A one-paragraph, vivid description of the scene, written in clear ${proficiency} level English. Do NOT just repeat the input; embellish it and make it engaging.",
      "vocabulary": [
        { "word": "string", "translation": "string", "explanation": "string" },
        { "word": "string", "translation": "string", "explanation": "string" },
        { "word": "string", "translation": "string", "explanation": "string" },
        { "word": "string", "translation": "string", "explanation": "string" },
        { "word": "string", "translation": "string", "explanation": "string" }
      ],
      "grammar": [
        { "point": "A key grammar point that is directly observable or relevant to the action in the scene.", "explanation": "string", "example": "An example sentence using the grammar point, directly referencing elements from the scene." }
      ],
      "dialogue": [
        { "speaker": "Character_A", "sentence": "A line of dialogue that would logically be spoken in this exact scene." },
        { "speaker": "Character_B", "sentence": "A responding line of dialogue relevant to the unique situation." },
        { "speaker": "Character_A", "sentence": "Another line of dialogue." },
        { "speaker": "Character_B", "sentence": "A final line of dialogue." }
      ]
    }

    CRITICAL INSTRUCTION: All generated content (title, situation, vocabulary, grammar, dialogue) MUST be directly inspired by the unique details of the user's scene description. Avoid generic or didactic content. Be creative and context-aware.
    For the "translation" field, provide a plausible translation in Japanese.
  `;
  // --- END UPGRADE ---

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the unique scene description: ${enhancedPrompt}` }
      ],
      response_format: { type: "json_object" },
    });
    
    const rawResponse = response.choices[0].message.content;
    
    console.log("--- RAW OPENAI RESPONSE ---");
    console.log(rawResponse);
    console.log("--------------------------");

    console.log("OpenAI Response received, parsing JSON...");
    const lessonData = JSON.parse(rawResponse);
    return lessonData;

  } catch (error) {
    console.error('Error generating lesson text from OpenAI:', error);
    throw new Error('Failed to generate lesson text.');
  }
}
