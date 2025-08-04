/**
 * =============================================================================
 * LINGUAVERSE - MODEL PORTFOLIO (GENRE-AWARE V2)
 * =============================================================================
 * File: /backend/config/modelPortfolio.js
 * * Update: Weights and genres have been recalibrated to establish a clear
 * hierarchy. 'rundiffusion' is the primary workhorse, while 'runware-97v2'
 * is a specialist for technological themes.
 * =============================================================================
 */

export const modelPortfolio = [
  {
    name: 'rundiffusion-pro (Workhorse)',
    modelId: 'rundiffusion:130@100', 
    provider: 'runware',
    weight: 6, // Higher weight makes it the default choice.
    cost: 0.0083,
    steps: 50,
    // This is now our general-purpose engine for all non-tech themes.
    genres: ['historical', 'fantasy', 'nature', 'modern']
  },
  {
    name: 'runware-97v2 (Tech Specialist)',
    modelId: 'runware:97@2', 
    provider: 'runware',
    weight: 3, // Lower weight, but will be chosen if genre matches.
    cost: 0.0077,
    steps: 50,
    // This model is now specialized for sci-fi and cyberpunk.
    genres: ['sci-fi', 'cyberpunk']
  },
  {
    name: 'seedream3-premium (High-Quality)',
    modelId: 'civitai:118913@448627', 
    provider: 'runware',
    weight: 0, // Lowest weight, for occasional high-impact results.
    cost: 0.03,
    steps: 100,
    // This remains our versatile, high-cost option.
    genres: ['fantasy', 'historical', 'sci-fi'] 
  },
];
