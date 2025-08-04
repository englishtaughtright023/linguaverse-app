/**
 * =============================================================================
 * LINGUAVERSE - PORTFOLIO ROUTES
 * =============================================================================
 * File: backend/routes/portfolioRoutes.js
 * * Mission: To provide the frontend with a list of available, active models
 * from the backend configuration.
 * =============================================================================
 */
import express from 'express';
import { modelPortfolio } from '../config/modelPortfolio.js';

const router = express.Router();

// GET /api/portfolio/models - Fetches all active models for the UI dropdown.
router.get('/models', (req, res) => {
  try {
    // Filter out any models that are disabled (weight: 0)
    const activeModels = modelPortfolio.filter(model => model.weight > 0);
    
    // We only need to send the name, modelId, and cost to the frontend.
    const clientSafeModels = activeModels.map(({ name, modelId, cost }) => ({
      name,
      modelId,
      cost,
    }));

    res.status(200).json(clientSafeModels);
  } catch (error) {
    console.error('Failed to fetch model portfolio:', error);
    res.status(500).json({ error: 'Failed to retrieve model portfolio.' });
  }
});

export default router;
