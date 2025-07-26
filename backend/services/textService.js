// -----------------------------------------------------------------------------
// FILE: backend/services/textService.js (The Linguistics Department)
// -----------------------------------------------------------------------------
// This service is responsible for generating all textual content for our lessons,
// including the main lesson JSON and the "Day in the Life" writing prompts.
// -----------------------------------------------------------------------------
// For now, we will use a placeholder for the AI call, but the prompt
// engineering logic is in place. We would use the Google AI API here in production.

/**
 * Generates the main, structured lesson text.
 * @param {string} topic - The user-selected topic (e.g., "The Castle Siege").
 * @param {string} proficiency - The user's proficiency level ('Beginner', 'Intermediate', 'Advanced').
 * @returns {object} A structured JSON object containing the lesson text.
 */
export async function generateLessonText(topic, proficiency = 'Intermediate') {
  console.log(`Generating lesson text for topic: ${topic} at ${proficiency} level.`);

  // --- MASTER PROMPT CONSTRUCTION ---
  const masterPrompt = `
    Role: You are an expert language teacher and a creative writer.
    Task: Create a cohesive, multi-part language lesson for an ${proficiency} English learner on the topic: "${topic}".
    Output Format: You must respond with a single, valid JSON object. Do not include any text outside of the JSON structure.
    JSON Structure and Content Requirements:
    - "title": A creative and engaging title for the lesson.
    - "explanation": An immersive, personalized, one-paragraph explanation of the situation from a first-person perspective ("Your Situation: ...").
    - "vocabulary": An array of 5 key vocabulary objects. Each object must have "word", "definition", and "example_sentence" keys.
    - "grammar_focus": An object with "rule" and "rule_example" keys, explaining a relevant grammar point.
    - "dialogue": An array of 3-4 dialogue objects, each with "character" and "line" keys, representing a short conversation.
  `;

  // --- SIMULATED AI CALL ---
  // In production, we would send 'masterPrompt' to the Google AI API.
  // For now, we return a mock object to simulate the response.
  const mockApiResponse = {
    title: `Surviving the Siege of Blackwood Keep`,
    explanation: `Your Situation: The air is thick with smoke and the sound of war drums. As a defender of this fortress, your duty is to hold the line until dawn. The enemy's siege towers are approaching the outer wall, and the archers must be ready to repel them. Your survival depends on your courage and your ability to communicate effectively under pressure.`,
    vocabulary: [
      { word: "Ramparts", definition: "The defensive walls of a castle.", example_sentence: "Archers, to the ramparts!" },
      { word: "Repel", definition: "To drive back or force away an attack.", example_sentence: "We must repel the first wave of attackers." },
      { word: "Garrison", definition: "The troops stationed in a fortress to defend it.", example_sentence: "The entire garrison has been called to the walls." },
      { word: "Trebuchet", definition: "A large medieval catapult.", example_sentence: "Their trebuchet is targeting the main gate." },
      { word: "Breach", definition: "A gap made in a wall or defense.", example_sentence: "They have made a breach in the western wall!" }
    ],
    grammar_focus: {
      rule: "Using the Imperative Mood to give direct commands.",
      rule_example: "Hold the line! Do not let them break through!"
    },
    dialogue: [
      { character: "Captain Valerius", line: "What is the status of the northern wall?" },
      { character: "You", line: "The ramparts are holding, but the main gate is taking heavy fire from their trebuchet." },
      { character: "Captain Valerius", line: "Understood. Repel their infantry at all costs. Hold until reinforcements arrive." }
    ]
  };

  // In a real scenario, we would parse the AI's JSON response.
  // return JSON.parse(aiResponse.text());
  return mockApiResponse;
}