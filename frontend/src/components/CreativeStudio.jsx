// -----------------------------------------------------------------------------
// FILE: frontend/src/components/CreativeStudio.jsx (CORRECTED)
// -----------------------------------------------------------------------------
// This version corrects the API endpoint for fetching the gallery.
// -----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreativeStudio({ viewLesson, userTokens, setUserTokens, API_BASE_URL }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      try {
        // CORRECTED: The endpoint is /api/lessons, not /api/lessons/all
        const response = await axios.get(`${API_BASE_URL}/api/lessons`); 
        setGallery(response.data);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
        setError("Could not connect to the lesson database. Is the backend server running?");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery(); 
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
      setGallery(prevGallery => [newLesson, ...prevGallery]);
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
      
      <div className="gallery-container">
        <h2>My Creations</h2>
        {isLoading && gallery.length === 0 && <p>Loading gallery...</p>}
        <div className="gallery-grid">
          {gallery.length === 0 && !isLoading && <p>Your generated lessons will appear here.</p>}
          {gallery.map((lesson) => (
            <div key={lesson._id} className="gallery-item" onClick={() => viewLesson(lesson)}>
              <img src={lesson.heroImageUrl} alt={lesson.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/0d0d1a/e0e0e0?text=Preview'; }}/>
              <div className="gallery-item-title">{lesson.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreativeStudio;