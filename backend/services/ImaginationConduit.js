/**
 * =============================================================================
 * LINGUAVERSE - IMAGINATION CONDUIT V6 (NARRATIVE DIVERSITY)
 * =============================================================================
 * File: /services/ImaginationConduit.js
 * * Mission: To explicitly command the text-generation AI to create a unique
 * character and situation for every request, ensuring true narrative diversity
 * and preventing thematic repetition.
 * =============================================================================
 */

// Local helper function for calling the text generation AI
async function callTextGenerationAI(prompt, expectJson = false) {
  console.log(`[Conduit V6]: Calling LIVE Text Generation AI. Expecting JSON: ${expectJson}`);
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in the environment variables.");
  }

  const payload = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9, // Slightly increased temperature for more creativity
  };

  if (expectJson) {
    payload.response_format = { type: "json_object" };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    if (expectJson) {
      return JSON.parse(content);
    } else {
      return content.trim();
    }

  } catch (error) {
    console.error("Failed during live AI call:", error);
    if (expectJson) {
      return { style: "Error", scene: "AI call failed.", vocabulary: [] };
    }
    return "A lone adventurer discovers a hidden waterfall.";
  }
}

// STAGE 1: Genre Analysis
async function getGenre(userInput) {
  console.log(`[Conduit V6]: Stage 1 - Analyzing genre for "${userInput}"`);
  const cacheBuster = `(Seed: ${Math.random()})`;
  const genrePrompt = `Analyze the following user prompt and classify it into one of these genres: "sci-fi", "fantasy", "historical", "modern", "nature". Respond with only the single genre name. Prompt: "${userInput}" ${cacheBuster}`;
  
  try {
    const genre = await callTextGenerationAI(genrePrompt, false);
    console.log(`[Conduit V6]: Genre identified: "${genre}"`);
    return genre.toLowerCase().replace(/[^a-z-]/g, '');
  } catch (error) {
    console.error('[Conduit V6]: Failed to identify genre.', error);
    return "modern";
  }
}

// STAGE 2: Final Prompt Generation
async function generateEnhancedPrompt(userInput) {
  const genre = await getGenre(userInput);
  const cacheBuster = `(Random Seed: ${Math.random()})`;

  // --- THIS IS THE REPAIR ---
  // The meta-prompt now includes a forceful, explicit instruction for
  // the AI to generate a unique character and situation every time.
  const metaPrompt = `
    You are an expert prompt engineer for an AI image generator.
    Your task is to expand the user's simple concept into a detailed, structured prompt.
    The user's concept is: "${userInput}".
    The identified genre is: "${genre}".

    CRITICAL INSTRUCTION: For every request, you MUST invent a COMPLETELY NEW and UNIQUE character and situation. Do NOT repeat characters or scenes. For example, if the concept is "ancient japan," avoid defaulting to a lone samurai. Instead, you could create a scene about a female calligrapher in a tranquil garden, a bustling fish market at dawn, a group of monks tending to a temple, or a noble courtier composing poetry. BE CREATIVE AND ENSURE NARRATIVE DIVERSITY.

    Generate a prompt with the following structure:
    - "Style": A short, creative description of the artistic style.
    - "Scene": A one-sentence description of the main scene and the UNIQUE central character you invented.
    - "Vocabulary": A list of exactly 10 specific, visually distinct nouns or short noun phrases related to the UNIQUE scene.

    The final output must be a single, valid JSON object with the keys "style", "scene", and "vocabulary".
    Do not include any preamble. ${cacheBuster}
  `;
  // --- END REPAIR ---

  try {
    console.log('[Conduit V6]: Stage 2 - Generating final structured prompt.');
    const structuredPromptData = await callTextGenerationAI(metaPrompt, true);

    const finalPromptString = [
      `Style: ${structuredPromptData.style}`,
      `Scene: ${structuredPromptData.scene}`,
      ...structuredPromptData.vocabulary
    ].join('\n');
    
    return {
      enhancedPrompt: finalPromptString,
      genre: genre
    };

  } catch (error) {
    console.error('[Conduit V6]: Critical failure during final prompt generation.', error);
    throw new Error('Failed to generate final prompt via Imagination Conduit.');
  }
}

export { generateEnhancedPrompt };
