import React from 'react';

function GalleryGrid({ lessons, onViewLesson }) {
  if (!lessons || lessons.length === 0) {
    return <p>No creations found.</p>;
  }

  return (
    <div className="gallery-grid">
      {lessons.map((lesson) => (
        // --- THIS IS THE FINAL CORRECTION ---
        // We now pass lesson._id instead of the whole lesson object.
        <div key={lesson._id} className="gallery-item" onClick={() => onViewLesson(lesson._id)}>
          <img 
            src={lesson.heroImageUrl} 
            alt={lesson.title} 
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src='https://placehold.co/600x400/0d0d1a/e0e0e0?text=Image+Failed'; 
            }}
          />
          <div className="gallery-item-title">{lesson.title}</div>
        </div>
      ))}
    </div>
  );
}

export default GalleryGrid;