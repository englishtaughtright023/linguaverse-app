import fetch from 'node-fetch';
import crypto from 'crypto';

const RUNWARE_API_URL = 'https://api.runware.ai/v1/images/generations';
const RUNWARE_API_KEY = process.env.RUNWARE_API_KEY;
const standardNegativePrompt = "cartoon, anime, painting, text, watermark, logos, ugly, deformed, blurry, generic, boring, celebrity, real person, likeness, modern objects, anachronism, clock, electricity";
const RUNWARE_MODEL_ID = 'runware:101@1';

async function generateImage(payload) {
  if (!RUNWARE_API_KEY) {
    console.error("RUNWARE_API_KEY not found in .env file.");
    return "https://placehold.co/600x400/282c34/ffffff?text=API+Key+Missing";
  }
  try {
    const response = await fetch(RUNWARE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RUNWARE_API_KEY}` },
      body: JSON.stringify([payload])
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Runware API error: ${response.statusText} - ${errorBody}`);
    }
    const data = await response.json();
    
    // =======================================================================
    // FINAL CORRECTION: The API response uses the key 'imageURL', not 'url'.
    // =======================================================================
    return data.data[0].imageURL; 

  } catch (error) {
    console.error("Failed to generate image:", error);
    return "https://placehold.co/600x400/282c34/ffffff?text=Image+Failed"; 
  }
}

export async function generateHeroImage(narrativePrompt) {
  console.log("Generating Tier 1 Hero Image...");
  const payload = {
    taskUUID: crypto.randomUUID(),
    taskType: 'imageInference',
    model: RUNWARE_MODEL_ID, 
    positivePrompt: `${narrativePrompt}, cinematic, hyperrealistic, dramatic lighting, 8k, ${standardNegativePrompt}`,
    n: 1,
    width: 1024,
    height: 576,
    steps: 50
  };
  return await generateImage(payload);
}

export async function generateChapterImage(narrativePrompt) {
  console.log("Generating Tier 2 Chapter Image...");
  const payload = {
    taskUUID: crypto.randomUUID(),
    taskType: 'imageInference',
    model: RUNWARE_MODEL_ID,
    positivePrompt: `${narrativePrompt}, book cover art, vertical composition, ${standardNegativePrompt}`,
    n: 1,
    width: 512,
    height: 768,
    steps: 50
  };
  return await generateImage(payload);
}

export async function generateDetailImage(objectPrompt) {
  console.log(`Generating Tier 3 Detail Image for: ${objectPrompt}`);
  const payload = {
    taskUUID: crypto.randomUUID(),
    taskType: 'imageInference',
    model: RUNWARE_MODEL_ID,
    positivePrompt: `photo of a single ${objectPrompt} on a clean, white background, studio lighting`,
    n: 1,
    width: 1024,
    height: 1024,
    steps: 50
  };
  return await generateImage(payload);
}
