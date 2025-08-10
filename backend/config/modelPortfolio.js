/**
 * =============================================================================
 * LINGUAVERSE - MODEL PORTFOLIO (STRATEGIC REASSIGNMENT)
 * =============================================================================
 * File: /config/modelPortfolio.js
 * * Mission: To temporarily reassign model specializations for diagnostic
 * * testing. The 'Tech Specialist' (runware:97@2) will now handle
 * * historical/fantasy prompts to test its performance on the "Zeus" topic.
 * =============================================================================
 */

export const modelPortfolio = [
  {
    name: "rundiffusion-pro (Workhorse)",
    modelId: "rundiffusion:130@100",
    cost: "~$0.0083",
    steps: 50,
    weight: 0,
    // --- TEMPORARILY REASSIGNED ---
    genres: ["sci-fi", "cyberpunk", "modern"], 
  },
  {
    name: "runware-97v2 (Tech Specialist)",
    modelId: "runware:97@2",
    cost: "~$0.0077",
    steps: 50,
    weight: 1,
    // --- TEMPORARILY REASSIGNED ---
    genres: ["historical", "fantasy", "nature"],
  },
  // Decommissioned model remains inactive.
  // {
  //   name: "runware-97v1 (Decommissioned)",
  //   modelId: "runware:97@1",
  //   cost: "~$0.0042",
  //   steps: 30,
  //   weight: 0, 
  //   genres: [],
  // },
];
