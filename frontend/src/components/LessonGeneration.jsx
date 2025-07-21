import React, { useState } from 'react';
import axios from 'axios';

function LessonGeneration() {
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
      // This URL now points to your public Codespace address
      const response = await axios.post('https://probable-dollop-779x77grw79cxqvv-3001.app.github.dev/api/generate', {
        topic,
        proficiency,
      });
      setLesson(response.data);
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
          <h3>Lesson: {topic}</h3>
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
        </div>
      )}
    </div>
  );
}

export default LessonGeneration;