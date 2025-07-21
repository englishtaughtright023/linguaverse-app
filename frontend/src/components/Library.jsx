import React from 'react';

// The component now accepts the savedLessons array as a prop
function Library({ savedLessons }) {
  return (
    <div>
      <h2>Library</h2>
      <p>Review your saved and generated lessons.</p>

      <div className="form-group">
        <input
          type="text"
          placeholder="Search saved lessons..."
          disabled
        />
      </div>

      <div className="lesson-library">
        {savedLessons.length === 0 ? (
          <p>You have no saved lessons yet.</p>
        ) : (
          // --- START: New Display Logic ---
          <ul style={{ padding: 0 }}>
            {savedLessons.map(lesson => (
              <li key={lesson.id} className="lesson-summary">
                <h3>{lesson.topic}</h3>
                <p>{lesson.explanation.substring(0, 150)}...</p>
              </li>
            ))}
          </ul>
          // --- END: New Display Logic ---
        )}
      </div>
    </div>
  );
}

export default Library;