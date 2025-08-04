import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import GalleryGrid from './GalleryGrid.jsx';

function MyCreations({ viewLesson, API_BASE_URL, currentLesson }) {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredAndSortedLessons = useMemo(() => {
    return lessons
      // =======================================================================
      // CORRECTION: Added a check to ensure 'lesson' and 'lesson.title' exist
      // before attempting to filter. This prevents the crash.
      // =======================================================================
      .filter(lesson => 
        lesson && lesson.title && lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [lessons, searchTerm]);

  return (
    <div className="my-creations-container">
      <h2 className="gallery-title">Your Arcade</h2>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search your creations by title..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {currentLesson && (
        <div className="current-lesson-container">
          <h3 className="current-lesson-header">Currently Viewing</h3>
          <div className="gallery-grid-single-item">
             <div className="gallery-item current" onClick={() => viewLesson(currentLesson)}>
                <img 
                  src={currentLesson.heroImageUrl} 
                  alt={currentLesson.title} 
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/0d0d1a/e0e0e0?text=Image+Failed'; }}
                />
                <div className="gallery-item-title">{currentLesson.title}</div>
              </div>
          </div>
        </div>
      )}

      <hr className="library-divider" />

      {isLoading && <p>Loading your arcade...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && (
        <GalleryGrid lessons={filteredAndSortedLessons} onViewLesson={viewLesson} />
      )}
    </div>
  );
}

export default MyCreations;