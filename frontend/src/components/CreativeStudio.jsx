import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GalleryGrid from './GalleryGrid.jsx'; // Import our reusable grid

function CreativeStudio({ viewLesson, userTokens, setUserTokens, API_BASE_URL }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State specifically for the gallery preview on this page
  const [recentLessons, setRecentLessons] = useState([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  // Fetch the gallery data when the component mounts
  useEffect(() => {
    const fetchRecentLessons = async () => {
      setIsGalleryLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/lessons`);
        // We only want to show a preview, e.g., the 6 most recent
        setRecentLessons(response.data.slice(0, 6)); 
      } catch (err) {
        console.error("Failed to fetch recent lessons:", err);
        // We don't set the main error state here, to avoid confusion
      } finally {
        setIsGalleryLoading(false);
      }
    };
    fetchRecentLessons(); 
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
      const response = await axios.post(`${API_BASE_URL}/api/lessons/generate`, {
        topic: prompt,
        proficiency: 'Intermediate'
      });
      
      const newLesson = response.data;
      
      // CRITICAL: Update the local gallery state instantly
      setRecentLessons(prevLessons => [newLesson, ...prevLessons].slice(0, 6));
      
      // Navigate to the full lesson view
      viewLesson(newLesson);

    } catch (err) {
      console.error("Lesson generation failed:", err);
      setError('An error occurred during lesson generation. Please check the backend server.');
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
        <button className="generate-button" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'GENERATING...' : 'GENERATE (5 TOKENS)'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      
      {/* --- RECENT CREATIONS GALLERY PREVIEW --- */}
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
