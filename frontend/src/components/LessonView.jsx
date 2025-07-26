
// -----------------------------------------------------------------------------
// FILE: frontend/src/components/LessonView.jsx (The Mission Briefing)
// -----------------------------------------------------------------------------
// No changes are needed here.
// -----------------------------------------------------------------------------
import React from 'react';

function LessonView({ lesson, returnToStudio, API_BASE_URL }) {
  if (!lesson) {
    return (
      <div>
        <p>No lesson selected.</p>
        <button onClick={returnToStudio}>Return to Studio</button>
      </div>
    );
  }

  return (
    <div className="lesson-view">
      <button onClick={returnToStudio} className="return-button">← Back to Creative Studio</button>
      
      <section className="lesson-section scene">
        <h2>{lesson.title}</h2>
        <img src={lesson.heroImageUrl} alt={lesson.title} className="hero-image" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x450/0d0d1a/e0e0e0?text=Image+Not+Available'; }}/>
        <h3>Your Situation</h3>
        <p>{lesson.explanation}</p>
      </section>

      <section className="lesson-section intel">
        <h3>Intel Briefing</h3>
        
        <h4>Key Vocabulary</h4>
        <ul className="vocabulary-list">
          {lesson.vocabulary.map((item, index) => (
            <li key={index}>
              <img src={item.imageUrl} alt={item.word} className="detail-image" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/0d0d1a/e0e0e0?text=...'; }}/>
              <div className="vocab-text">
                <strong>{item.word}:</strong> {item.definition}
                <br/>
                <em>"{item.example_sentence}"</em>
              </div>
            </li>
          ))}
        </ul>

        <h4>Grammar Focus: {lesson.grammar_focus.rule}</h4>
        <p><em>Example: "{lesson.grammar_focus.rule_example}"</em></p>

        <h4>Field Dialogue</h4>
        <div className="dialogue">
          {lesson.dialogue.map((line, index) => (
            <p key={index}><strong>{line.character}:</strong> {line.line}</p>
          ))}
        </div>
      </section>

      <section className="lesson-section training">
        <h3>Training Simulation</h3>
        <p>(Interactive components for writing and speaking will be built here.)</p>
        <div className="lives-display">LIVES: 3</div>
      </section>
    </div>
  );
}

export default LessonView;