// File: backend/services/writingService.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateWritingAssignment(lessonTitle, lessonSituation) {
  console.log(`[Writing Service]: Generating assignment for lesson: "${lessonTitle}"`);

  const systemPrompt = `
    You are a creative writing coach. Based on a lesson's title and situation, your task is to generate a short, first-person "Daydream Scenario" and a matrix of three distinct writing prompts.
    Your output MUST be a single, valid JSON object and nothing else.
    The JSON object must strictly adhere to the following structure:

    {
      "daydreamScenario": "A short, evocative, first-person narrative (2-3 sentences) that immerses the user in a role related to the lesson's situation.",
      "promptMatrix": [
        { "id": "immersive", "text": "An immersive, first-person prompt asking the user to continue the daydream or a journal entry." },
        { "id": "analytical", "text": "An analytical prompt asking the user to speculate on challenges, rewards, or motivations related to the scene." },
        { "id": "descriptive", "text": "A descriptive prompt asking the user to describe the scene from a unique perspective (e.g., an animal or object)." }
      ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Lesson Title: ${lessonTitle}\nLesson Situation: ${lessonSituation}` }
      ],
      response_format: { type: "json_object" },
    });

    const assignmentData = JSON.parse(response.choices[0].message.content);
    console.log(`[Writing Service]: Assignment generated successfully.`);
    return assignmentData;

  } catch (error) {
    console.error('[Writing Service]: Error generating writing assignment:', error);
    throw new Error('Failed to generate writing assignment.');
  }
}

// --- NEW FUNCTION TO PROVIDE FEEDBACK ---
export async function getWritingFeedback(prompt, userWriting) {
    console.log('[Writing Service]: Generating feedback for user writing.');

    const systemPrompt = `
        You are an encouraging and helpful language tutor. The user was given a writing prompt and has submitted their response. Your task is to provide constructive feedback in a specific JSON format.
        Your output MUST be a single, valid JSON object and nothing else.
        The JSON object must strictly adhere to the following structure:

        {
            "strengths": "A positive, encouraging sentence about what the user did well.",
            "corrections": [
                { "original": "the part of the user's text with an error", "suggestion": "the corrected version" }
            ],
            "alternatives": [
                "A suggestion for a more poetic or descriptive phrasing.",
                "A suggestion for a more formal or technical phrasing."
            ]
        }

        If there are no grammatical errors, the "corrections" array should be empty.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `The prompt was: "${prompt}"\nThe user wrote: "${userWriting}"` }
            ],
            response_format: { type: "json_object" },
        });

        const feedbackData = JSON.parse(response.choices[0].message.content);
        console.log('[Writing Service]: Feedback generated successfully.');
        return feedbackData;

    } catch (error) {
        console.error('[Writing Service]: Error generating writing feedback:', error);
        throw new Error('Failed to generate writing feedback.');
    }
}