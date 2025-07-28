import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GalleryGrid from './GalleryGrid.jsx'; // We will use the reusable grid

function MyCreations({ viewLesson, API_BASE_URL }) {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllLessons = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/lessons`);
        setLessons(response.data);
      } catch (err) {
        console.error("Failed to fetch all lessons:", err);
        setError("Could not retrieve your creations. Please check the server connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllLessons();
  }, [API_BASE_URL]);

  return (
    <div className="my-creations-container">
      <h2 className="gallery-title">Your Arcade</h2>
      {isLoading && <p>Loading your arcade...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && (
        <GalleryGrid lessons={lessons} onViewLesson={viewLesson} />
      )}
    </div>
  );
}

export default MyCreations;