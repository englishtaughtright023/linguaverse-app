import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import GalleryGrid from './GalleryGrid.jsx';
// --- THIS IS THE FINAL REPAIR ---
// The direct import has been REMOVED. The component now fetches this data
// from the backend via an API call.
// --- END REPAIR ---

function CreativeStudio({ viewLesson, userTokens, setUserTokens, API_BASE_URL }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedModelId, setSelectedModelId] = useState('automatic');
  
  // --- THIS IS THE REPAIR ---
  // New state to hold the models fetched from our new API endpoint.
  const [availableModels, setAvailableModels] = useState([]);
  // --- END REPAIR ---

  const [recentLessons, setRecentLessons] = useState([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  // This useEffect now fetches both recent lessons AND the model portfolio.
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch recent lessons
      setIsGalleryLoading(true);
      try {
        const lessonsResponse = await axios.get(`${API_BASE_URL}/api/lessons`);
        setRecentLessons(lessonsResponse.data.slice(0, 6)); 
      } catch (err) {
        console.error("Failed to fetch recent lessons:", err);
      } finally {
        setIsGalleryLoading(false);
      }

      // --- THIS IS THE REPAIR ---
      // Fetch the available models from our new endpoint.
      try {
        const modelsResponse = await axios.get(`${API_BASE_URL}/api/portfolio/models`);
        setAvailableModels(modelsResponse.data);
      } catch (err) {
        console.error("Failed to fetch model portfolio:", err);
      }
      // --- END REPAIR ---
    };
    fetchInitialData(); 
  }, [API_BASE_URL]);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a topic to generate a lesson.');
      return;
    }
    if (userTokens < 5) {
      setError('Not enough tokens to generate a new lesson.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      setUserTokens(prev => prev - 5);

      const payload = {
        topic: prompt,
        proficiency: 'Intermediate',
      };

      if (selectedModelId !== 'automatic') {
        payload.modelId = selectedModelId;
      }

      const response = await axios.post(`${API_BASE_URL}/api/lessons/generate`, payload);
      
      const newLesson = response.data;
      setRecentLessons(prevLessons => [newLesson, ...prevLessons].slice(0, 6));
      viewLesson(newLesson);

    } catch (err) {
      console.error("Lesson generation failed:", err);
      const errorMessage = err.response?.data?.error || 'An error occurred during lesson generation.';
      setError(errorMessage);
      setUserTokens(prev => prev + 5);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="creative-studio">
      <div className="prompt-container">
        <textarea
          className="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a topic to create a lesson... (e.g., 'A cybernetic detective in a rainy city')"
          disabled={isLoading}
        />
        <div className="generation-controls">
            <select 
                className="model-selector"
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                disabled={isLoading}
            >
                <option value="automatic">Automatic (Recommended)</option>
                {/* The dropdown now maps over the 'availableModels' state */}
                {availableModels.map(model => (
                    <option key={model.modelId} value={model.modelId}>
                        {model.name} (${model.cost})
                    </option>
                ))}
            </select>
            <button className="generate-button" onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? 'GENERATING...' : 'GENERATE (5 TOKENS)'}
            </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      
      <div className="gallery-preview-container">
        <h2 className="gallery-title">Recent Creations</h2>
        {isGalleryLoading && <p>Loading recent work...</p>}
        {!isGalleryLoading && (
          <GalleryGrid lessons={recentLessons} onViewLesson={viewLesson} />
        )}
      </div>
    </div>
  );
}

export default CreativeStudio;
