// -----------------------------------------------------------------------------
// FILE: backend/services/imageService.js (The Art Department)
// -----------------------------------------------------------------------------
import fetch from 'node-fetch';

const RUNWARE_API_URL = 'https://api.runware.ai/v1/images/generations';
const RUNWARE_API_KEY = process.env.RUNWARE_API_KEY;
const standardNegativePrompt = "cartoon, anime, painting, text, watermark, logos, ugly, deformed, blurry, generic, boring, celebrity, real person, likeness, modern objects, anachronism, clock, electricity";

async function generateImage(payload) {
  if (!RUNWARE_API_KEY) {
    console.error("RUNWARE_API_KEY not found in .env file.");
    return "https://placehold.co/600x400/282c34/ffffff?text=API+Key+Missing";
  }
  try {
    const response = await fetch(RUNWARE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RUNWARE_API_KEY}` },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Runware API error: ${response.statusText} - ${errorBody}`);
    }
    const data = await response.json();
    // Path to URL might differ, adjust based on actual API response
    // Assuming the URL is in data.data[0].url based on common patterns
    return data.data[0].url; 
  } catch (error) {
    console.error("Failed to generate image:", error);
    return "https://placehold.co/600x400/282c34/ffffff?text=Image+Failed"; 
  }
}

export async function generateHeroImage(narrativePrompt) {
  console.log("Generating Tier 1 Hero Image...");
  const payload = {
    model: 'flux-kontext-max', 
    prompt: `${narrativePrompt}, ${standardNegativePrompt}`,
    n: 1,
    size: '1792x1024',
    steps: 50
  };
  return await generateImage(payload);
}

export async function generateChapterImage(narrativePrompt) {
  console.log("Generating Tier 2 Chapter Image...");
  const payload = {
    model: 'flux-schnell',
    prompt: `${narrativePrompt}, ${standardNegativePrompt}`,
    n: 1,
    size: '896x1536',
    steps: 100
  };
  return await generateImage(payload);
}

export async function generateDetailImage(objectPrompt) {
  console.log(`Generating Tier 3 Detail Image for: ${objectPrompt}`);
  const payload = {
    model: 'flux-schnell',
    prompt: `photo of a single ${objectPrompt} on a clean, white background, studio lighting`,
    n: 1,
    size: '256x256',
    steps: 4
  };
  return await generateImage(payload);
}