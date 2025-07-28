import React from 'react';

function LessonView({ lesson, returnToStudio }) {
  if (!lesson) {
    return (
      <div className="lesson-view-container">
        <h2 className="error-message">No lesson data found.</h2>
        <button className="lesson-back-button" onClick={returnToStudio}>
          &larr; Back
        </button>
      </div>
    );
  }

  const {
    title,
    heroImageUrl,
    situation,
    vocabulary,
    grammar, // This is the object: { rule, example }
    dialogue
  } = lesson;

  return (
    <div className="lesson-view-container">
      <img 
        src={heroImageUrl} 
        alt={title} 
        className="lesson-hero-image"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src='https://placehold.co/1600x900/0d0d1a/e0e0e0?text=16:9+Hero+Image'; 
        }}
      />

      <h1 className="lesson-main-title">{title}</h1>

      <button className="lesson-back-button" onClick={returnToStudio}>
        &larr; Back
      </button>

      <div className="lesson-section">
        <h3 className="lesson-section-header">Your Situation</h3>
        <p>{situation || "No situation description provided."}</p>
      </div>

      <div className="lesson-section">
        <h3 className="lesson-section-header">Key Vocabulary</h3>
        <ul className="vocab-list">
          {vocabulary && vocabulary.length > 0 ? (
            vocabulary.map((item, index) => (
              <li key={index} className="vocab-item">
                <span className="vocab-term">{item.word}</span>
                <span className="vocab-definition">{item.translation}</span>
              </li>
            ))
          ) : (
            <p>No vocabulary provided.</p>
          )}
        </ul>
      </div>

      {/* --- GRAMMAR SECTION FIX --- */}
      <div className="lesson-section">
        <h3 className="lesson-section-header">Grammar Focus</h3>
        {grammar ? (
          <div>
            <p className="grammar-rule"><strong>Rule:</strong> {grammar.rule}</p>
            <p className="grammar-example"><strong>Example:</strong> "{grammar.example}"</p>
          </div>
        ) : (
          <p>No grammar explanation provided.</p>
        )}
      </div>

      <div className="lesson-section">
        <h3 className="lesson-section-header">Dialogue</h3>
        <div className="dialogue-container">
          {dialogue && dialogue.length > 0 ? (
            dialogue.map((line, index) => (
              <div key={index} className="dialogue-line">
                <span className="dialogue-speaker">{line.speaker}:</span>
                <span className="dialogue-text">{line.line}</span>
              </div>
            ))
          ) : (
            <p>No dialogue provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonView;