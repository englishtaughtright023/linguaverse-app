import React from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://probable-dollop-779x77grw79cxqvv-3001.app.github.dev';

function Library({ savedLessons, fetchLessons, selectedLessons, setSelectedLessons }) {

  const handleToggleSelection = (lessonId) => {
    setSelectedLessons(prevSelected =>
      prevSelected.includes(lessonId)
        ? prevSelected.filter(id => id !== lessonId)
        : [...prevSelected, lessonId]
    );
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedLessons.length} lesson(s)?`)) {
      try {
        await axios.post(`${API_BASE_URL}/api/lessons/batch-delete`, { ids: selectedLessons });
        await fetchLessons(); // Refresh the lesson list
        setSelectedLessons([]); // Clear the selection
      } catch (error) {
        console.error('Failed to delete selected lessons:', error);
        alert('Error: Could not delete the selected lessons.');
      }
    }
  };

  return (
    <div>
      <h2>Library</h2>
      <p>Review your saved and generated lessons.</p>

      <div className="form-group">
        <input type="text" placeholder="Search saved lessons..." disabled />
        {/* --- NEW: Master Delete Button --- */}
        {selectedLessons.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            style={{ backgroundColor: '#dc3545', color: 'white', marginLeft: '10px' }}
          >
            Delete Selected ({selectedLessons.length})
          </button>
        )}
      </div>

      <div className="lesson-library">
        {savedLessons.length === 0 ? (
          <p>You have no saved lessons yet.</p>
        ) : (
          <ul style={{ padding: 0 }}>
            {savedLessons.map(lesson => (
              <li key={lesson._id} className="lesson-summary" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* --- NEW: Checkbox --- */}
                <input
                  type="checkbox"
                  checked={selectedLessons.includes(lesson._id)}
                  onChange={() => handleToggleSelection(lesson._id)}
                  style={{ transform: 'scale(1.5)' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <h3>{lesson.topic}</h3>
                  <p>{lesson.explanation.substring(0, 150)}...</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Library;