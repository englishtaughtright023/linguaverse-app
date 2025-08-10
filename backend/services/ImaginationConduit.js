/**
 * =============================================================================
 * LINGUAVERSE - IMAGINATION CONDUIT V10 (CONSTRAINT REFINEMENT)
 * =============================================================================
 * File: /services/ImaginationConduit.js
 * * Mission: To correct the "constraint bleed" issue by replacing the
 * * overly specific creative constraints with a more thematically neutral set,
 * * ensuring the random element enhances, rather than overrides, the user's topic.
 * =============================================================================
 */

// Helper function for all OpenAI API calls
async function callTextGenerationAI(prompt, expectJson = false) {
  console.log(`[Conduit V10]: Calling OpenAI API. Expecting JSON: ${expectJson}`);
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not defined.");

  const payload = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 1.0,
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

    return expectJson ? JSON.parse(content) : content.trim();

  } catch (error) {
    console.error("Failed during live AI call:", error);
    throw error;
  }
}

// STAGE 1: Topic Classification (Unchanged)
async function classifyTopic(userInput) {
  console.log(`[Conduit V10]: Stage 1 - Classifying topic: "${userInput}"`);
  const classificationPrompt = `
    Analyze the user's topic and classify it into ONE of the following five categories:
    "thematic", "grammatical", "abstract", "copyright", "unknown".
    Respond with ONLY the single category name in lowercase.
    Topic: "${userInput}"
  `;
  
  try {
    const category = await callTextGenerationAI(classificationPrompt);
    console.log(`[Conduit V10]: Topic classified as: "${category}"`);
    return category.replace(/[^a-z]/g, '');
  } catch (error) {
    console.error('[Conduit V10]: Failed to classify topic. Defaulting to "thematic".', error);
    return "thematic";
  }
}

// STAGE 2: Protocol-Specific Prompt Generation
async function generatePromptFromClassification(userInput, category) {
    console.log(`[Conduit V10]: Stage 2 - Engaging protocol for "${category}"`);
    let metaPrompt = '';

    // --- THIS IS THE UPGRADE: The constraints are now thematically neutral. ---
    const creativeConstraints = [
        "The scene must be viewed from a low angle, looking up.",
        "The main character must be a reluctant hero.",
        "The lighting must be dramatic, with strong contrasts between light and shadow (chiaroscuro).",
        "The scene must take place at dawn, with a sense of new beginnings.",
        "The central character must be a wise mentor figure.",
        "The composition must use a strong sense of symmetry.",
        "The mood must be one of quiet contemplation.",
        "The scene must be depicted in a minimalist style, focusing on only a few key elements."
    ];
    const randomConstraint = creativeConstraints[Math.floor(Math.random() * creativeConstraints.length)];

    const baseInstructions = `
        You are an expert prompt engineer. Your primary task is to create a detailed, structured prompt for an AI image generator.
        The final output must be a single, valid JSON object with keys "style", "scene", and "vocabulary" (a list of 10 nouns). Do not include any preamble.
    `;

    const diversityInstruction = `
        To ensure creativity, you MUST invent a new and unique situation. Do NOT simply depict the subject in a default or common setting.
        Additionally, you MUST incorporate the following creative constraint into your scene: "${randomConstraint}"
    `;

    switch (category) {
        case 'grammatical':
            metaPrompt = `
                ${baseInstructions}
                The user's topic is the grammatical concept: "${userInput}".
                Your task is to invent a scene that PERFECTLY DEMONSTRATES this grammatical rule.
                ${diversityInstruction}
            `;
            break;
        
        case 'abstract':
            metaPrompt = `
                ${baseInstructions}
                The user's topic is the abstract concept: "${userInput}".
                Your task is to invent a scene that SYMBOLIZES this concept.
                ${diversityInstruction}
            `;
            break;

        case 'copyright':
            throw new Error(`Copyrighted Topic: "${userInput}" cannot be used for lesson generation.`);

        case 'thematic':
        case 'unknown':
        default:
            metaPrompt = `
                ${baseInstructions}
                The user's topic is: "${userInput}".
                Your task is to create a scene based on this topic. The subject of the scene MUST be "${userInput}".
                ${diversityInstruction}
            `;
            break;
    }

    return await callTextGenerationAI(metaPrompt, true);
}


// MAIN EXPORTED FUNCTION (Unchanged)
async function analyzeAndGeneratePrompt(userInput) {
  try {
    const category = await classifyTopic(userInput);

    if (category === 'copyright') {
        throw new Error(`Copyrighted material ("${userInput}") is not permitted.`);
    }

    const structuredPromptData = await generatePromptFromClassification(userInput, category);

    const finalPromptString = [
      `Style: ${structuredPromptData.style}`,
      `Scene: ${structuredPromptData.scene}`,
      ...structuredPromptData.vocabulary
    ].join('\n');
    
    const genre = (category === 'thematic' || category === 'unknown') ? 'modern' : category;

    return {
      enhancedPrompt: finalPromptString,
      genre: genre 
    };

  } catch (error) {
    console.error('[Conduit V10]: Critical failure during prompt generation.', error);
    throw error;
  }
}

export { analyzeAndGeneratePrompt };
