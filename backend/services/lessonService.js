/**
 * =============================================================================
 * LINGUAVERSE - LESSON SERVICE (WEIGHT CORRECTION)
 * =============================================================================
 * File /services/lessonService.js
 * * Mission: To correct the model selection logic to ensure that a model
 * * with a weight of 0 is never selected, giving the Captain full manual
 * * control over the active portfolio.
 * =============================================================================
 */

import { generateHeroImage } from './imageService.js';
import { analyzeAndGeneratePrompt } from './ImaginationConduit.js';
import { generateLessonText } from './textService.js';
import { modelPortfolio } from '../config/modelPortfolio.js';

export async function generateFullLesson(options) {
  try {
    const { topic, proficiency = 'Intermediate', modelId } = options;
    
    const { enhancedPrompt, genre } = await analyzeAndGeneratePrompt(topic);

    let selectedModel;

    if (modelId) {
      selectedModel = modelPortfolio.find(m => m.modelId === modelId);
      if (!selectedModel) throw new Error(`Invalid modelId: ${modelId}`);
      console.log(`[User Override]: Using selected model "${selectedModel.name}"`);
    } else {
      // --- THIS IS THE CORRECTION ---
      // 1. First, filter the entire portfolio to only include active models.
      const activeModels = modelPortfolio.filter(m => m.weight > 0);
      if (activeModels.length === 0) {
        throw new Error("No active models available in the portfolio.");
      }

      // 2. Then, find specialists FROM THE ACTIVE LIST.
      let candidateModels = activeModels.filter(m => m.genres.includes(genre));

      // 3. If no specialist is found, fall back to ALL active models.
      if (candidateModels.length === 0) {
        console.log(`[Model Director]: No specialist found for genre "${genre}". Falling back to all active models.`);
        candidateModels = activeModels;
      }
      // --- END CORRECTION ---

      const totalWeight = candidateModels.reduce((sum, model) => sum + model.weight, 0);
      let random = Math.random() * totalWeight;
      for (const model of candidateModels) {
        if (random < model.weight) {
          selectedModel = model;
          break;
        }
        random -= model.weight;
      }
      if (!selectedModel) selectedModel = candidateModels[0];
      console.log(`[Model Director]: Genre is "${genre}". Selected specialist: "${selectedModel.name}"`);
    }
    
    console.log(`--- Initiating lesson for topic: ${topic} with model: ${selectedModel.name} ---`);

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
