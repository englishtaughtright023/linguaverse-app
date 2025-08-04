/**
 * =============================================================================
 * LINGUAVERSE - LESSON SERVICE (GENRE-AWARE)
 * =============================================================================
 * File /services/lessonService.js
 * * Mission: To implement the final, most sophisticated layer of our strategy:
 * genre-aware model routing. The Model Director is now intelligent.
 * =============================================================================
 */

import { generateHeroImage } from './imageService.js';
import { generateEnhancedPrompt } from './ImaginationConduit.js';
import { generateLessonText } from './textService.js';
import { modelPortfolio } from '../config/modelPortfolio.js';

export async function generateFullLesson(options) {
  try {
    const { topic, proficiency = 'Intermediate', modelId } = options;
    
    // --- THIS IS THE FINAL UPGRADE ---
    // 1. The conduit now returns an object with the prompt and the genre.
    const { enhancedPrompt, genre } = await generateEnhancedPrompt(topic);
    // --- END FINAL UPGRADE ---

    let selectedModel;

    if (modelId) {
      // User override remains the highest priority.
      selectedModel = modelPortfolio.find(m => m.modelId === modelId);
      if (!selectedModel) throw new Error(`Invalid modelId: ${modelId}`);
      console.log(`[User Override]: Using selected model "${selectedModel.name}"`);
    } else {
      // --- THIS IS THE FINAL UPGRADE: INTELLIGENT ROUTING ---
      // 2. Filter the portfolio to find models that specialize in the identified genre.
      let candidateModels = modelPortfolio.filter(m => m.genres.includes(genre));

      // 3. If no specialist is found, fall back to all active models.
      if (candidateModels.length === 0) {
        console.log(`[Model Director]: No specialist found for genre "${genre}". Falling back to all active models.`);
        candidateModels = modelPortfolio.filter(m => m.weight > 0);
      }
      if (candidateModels.length === 0) {
        throw new Error("No active models available in the portfolio.");
      }

      // 4. Perform a weighted random selection FROM THE CANDIDATE LIST.
      const totalWeight = candidateModels.reduce((sum, model) => sum + model.weight, 0);
      let random = Math.random() * totalWeight;
      for (const model of candidateModels) {
        if (random < model.weight) {
          selectedModel = model;
          break;
        }
        random -= model.weight;
      }
      if (!selectedModel) selectedModel = candidateModels[0]; // Fallback
      console.log(`[Model Director]: Genre is "${genre}". Selected specialist: "${selectedModel.name}"`);
      // --- END FINAL UPGRADE ---
    }
    
    console.log(`--- Initiating lesson for topic: ${topic} with model: ${selectedModel.name} ---`);

    // The rest of the system now uses the intelligently selected model.
    const lessonTextData = await generateLessonText(enhancedPrompt, proficiency); 
    const heroImageUrl = await generateHeroImage(enhancedPrompt, selectedModel.modelId, { steps: selectedModel.steps });
    
    const finalLesson = {
      topic: topic,
      modelUsed: selectedModel.name,
      promptUsed: enhancedPrompt,
      heroImageUrl: heroImageUrl,
      title: lessonTextData.title,
      situation: lessonTextData.situation,
      vocabulary: lessonTextData.vocabulary,
      grammar: lessonTextData.grammar,
      dialogue: lessonTextData.dialogue,
      createdAt: new Date(),
    };

    console.log(`--- Lesson generation for topic: ${topic} complete. ---`);
    return finalLesson;

  } catch (error) {
    console.error('[Lesson Service Error]: Failed to generate full lesson.', error);
    throw error; 
  }
}
