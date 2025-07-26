// -----------------------------------------------------------------------------
// FILE: backend/services/lessonService.js (The Factory Foreman)
// -----------------------------------------------------------------------------
// This service orchestrates the entire lesson generation process by calling
// the other specialized services in the correct order.
// -----------------------------------------------------------------------------
import { generateLessonText } from './textService.js';
import { generateHeroImage, generateChapterImage, generateDetailImage } from './imageService.js';

/**
 * Generates a complete, multi-layered lesson package.
 * @param {string} topic - The user-selected topic.
 * @param {string} proficiency - The user's proficiency level.
 * @returns {object} The final, complete lesson object.
 */
export async function generateFullLesson(topic, proficiency = 'Intermediate') {
  console.log(`--- Initiating full lesson generation for topic: ${topic} ---`);

  // --- STEP 1: Generate all textual content ---
  const lessonTextData = await generateLessonText(topic, proficiency);
  
  // --- STEP 2: Generate all visual assets in parallel ---
  // This is more efficient than doing them one by one.
  
  // 2a: Generate the Tier 1 Hero Image based on the explanation
  const heroImagePromise = generateHeroImage(lessonTextData.explanation);
  
  // 2b: Generate the Tier 2 Chapter Image (for now, we'll base it on the title)
  const chapterImagePromise = generateChapterImage(`A book cover illustration for a story titled '${lessonTextData.title}'`);

  // 2c: Generate Tier 3 Detail Images for each vocabulary word
  const detailImagePromises = lessonTextData.vocabulary.map(vocabItem => 
    generateDetailImage(vocabItem.word)
  );

  // Wait for all image generation promises to resolve
  const [
    heroImageUrl,
    chapterImageUrl,
    ...detailImageUrls
  ] = await Promise.all([
    heroImagePromise,
    chapterImagePromise,
    ...detailImagePromises
  ]);

  // --- STEP 3: Assemble the final lesson object ---
  
  // Add the generated detail image URLs back into the vocabulary objects
  const vocabularyWithImages = lessonTextData.vocabulary.map((vocabItem, index) => ({
    ...vocabItem,
    imageUrl: detailImageUrls[index]
  }));

  const finalLesson = {
    topic: topic,
    proficiency: proficiency,
    createdAt: new Date(),
    ...lessonTextData, // Spread in title, explanation, grammar, dialogue
    vocabulary: vocabularyWithImages, // Use the new vocabulary array with image URLs
    heroImageUrl: heroImageUrl,
    chapterImageUrl: chapterImageUrl,
    // We will add the interactive components (audio, etc.) later
  };

  console.log(`--- Full lesson generation for topic: ${topic} complete. ---`);
  return finalLesson;
}
