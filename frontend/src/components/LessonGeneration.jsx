import React, { useState } from 'react';
import axios from 'axios';

// The component now accepts the saveLesson function as a prop
function LessonGeneration({ saveLesson }) {
  const [topic, setTopic] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setLoading(true);
    setError('');
    setLesson(null);

    try {
      // --- CORRECTED: Use the public Codespace URL ---
      const response = await axios.post('https://probable-dollop-779x77grw79cxqvv-3001.app.github.dev/api/generate', {
        topic,
        proficiency,
      });
      // Add the topic to the lesson object before setting it
      setLesson({ ...response.data, topic });
    } catch (err) {
      setError('Failed to generate lesson. Please check the backend server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Lesson Generator</h2>
      <div className="form-group">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., 'Ordering Coffee')"
        />
        <select value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Lesson'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {lesson && (
        <div className="lesson">
          <h3>Lesson: {lesson.topic}</h3>
          <div className="lesson-section">
            <h4>Explanation</h4>
            <p>{lesson.explanation}</p>
          </div>
          <div className="lesson-section">
            <h4>Vocabulary</h4>
            <ul>
              {lesson.vocabulary.map((item, index) => (
                <li key={index}>
                  <strong>{item.word}:</strong> {item.definition}
                </li>
              ))}
            </ul>
          </div>
          <div className="lesson-section">
            <h4>Grammar</h4>
            <p><strong>Rule:</strong> {lesson.grammar.rule}</p>
            <p><strong>Example:</strong> "{lesson.grammar.example}"</p>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={() => saveLesson(lesson)}>
              Save Lesson to Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonGeneration;