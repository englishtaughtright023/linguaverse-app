import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import GalleryGrid from './GalleryGrid.jsx';

function CreativeStudio({ viewLesson, userTokens, setUserTokens, API_BASE_URL }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedModelId, setSelectedModelId] = useState('automatic');
  
  const [availableModels, setAvailableModels] = useState([]);
  
  const [recentLessons, setRecentLessons] = useState([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsGalleryLoading(true);
      try {
        const lessonsResponse = await axios.get(`${API_BASE_URL}/api/lessons`);
        setRecentLessons(lessonsResponse.data.slice(0, 6)); 
      } catch (err) {
        console.error("Failed to fetch recent lessons:", err);
      } finally {
        setIsGalleryLoading(false);
      }

      try {
        const modelsResponse = await axios.get(`${API_BASE_URL}/api/portfolio/models`);
        setAvailableModels(modelsResponse.data);
      } catch (err) {
        console.error("Failed to fetch model portfolio:", err);
      }
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

      // --- THIS IS THE CORRECTION ---
      // The URL has been changed from '/api/lessons/generate' to '/api/lessons'
      const response = await axios.post(`${API_BASE_URL}/api/lessons`, payload);
      // --- END CORRECTION ---
      
      const newLesson = response.data;
      setRecentLessons(prevLessons => [newLesson, ...prevLessons].slice(0, 6));
      viewLesson(newLesson._id); // We now pass the ID to trigger a full data fetch

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