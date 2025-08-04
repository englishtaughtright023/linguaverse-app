/**
 * =============================================================================
 * LINGUAVERSE - IMAGE SERVICE (FINAL - SYNCHRONOUS)
 * =============================================================================
 * File: /services/imageService.js
 * * Mission: To generate an image by making a single, direct API call to the
 * Runware service and parsing the immediate response.
 *
 * Update: All asynchronous polling logic has been removed, as the API returns
 * the image URL directly for this model. This is the final and correct version.
 * =============================================================================
 */

import crypto from 'crypto';

/**
 * The core image generation function.
 * @param {string} prompt - The detailed prompt for the image.
 * @param {string} modelId - The ID of the model to use (e.g., 'runware:101@1').
 * @param {object} [params={}] - Other parameters like negative_prompt, seed, etc.
 * @returns {Promise<string>} A promise that resolves to the REAL generated image URL.
 */
async function generateImage(prompt, modelId, params = {}) {
  // Input validation.
  if (typeof modelId !== 'string' || !modelId) {
    console.error(`[Image Service]: CRITICAL ERROR - Invalid modelId received. Defaulting to a safe model.`);
    modelId = 'sdxl:101'; 
  }

  console.log(`[Image Service]: Initiating LIVE image generation with model: ${modelId}`);

  const payload = {
    model: modelId,
    taskType: 'imageInference',
    taskUUID: crypto.randomUUID(), 
    positivePrompt: prompt,
    width: 1024,
    height: 512,
    ...params
  };
  delete payload.steps;

  const baseArchitecture = modelId.split(':')[0].toLowerCase();
  
  if (baseArchitecture !== 'imagen3') {
    payload.steps = (params && params.steps) ? params.steps : 30;
  }
  
  try {
    console.log('[Image Service]: Sending final payload to Runware API:', payload);

    const apiKey = process.env.RUNWARE_API_KEY;
    if (!apiKey) {
      throw new Error("RUNWARE_API_KEY is not defined in the environment variables.");
    }

    const endpointURL = `https://api.runware.ai/v1/models/${modelId}/generate`;
    
    const response = await fetch(endpointURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify([payload]) 
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Runware API Error Response:', errorData);
      throw new Error(`Runware API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // --- THIS IS THE CORRECTION ---
    // We parse the direct response, as no polling is needed.
    const imageUrl = result.data[0]?.imageURL;

    if (!imageUrl) {
        console.error("[Image Service]: API response did not contain an imageURL.", result);
        throw new Error("API response was successful but did not contain an imageURL.");
    }
    
    console.log(`[Image Service]: LIVE image generated successfully. URL: ${imageUrl}`);
    return imageUrl;

  } catch (error) {
    console.error('Failed to generate live image:', error.message);
    throw error;
  }
}


// --- EXPORTED FUNCTIONS ---
// No changes are needed here.

async function generateHeroImage(prompt, modelId) {
    console.log("[Image Service]: Generating HERO image.");
    const params = {
        negative_prompt: "blurry, low quality, text, watermark, signature",
        seed: Math.floor(Math.random() * 1000000),
        steps: 50
    };
    return generateImage(prompt, modelId, params);
}

export { 
    generateImage, 
    generateHeroImage
};
