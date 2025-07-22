import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import LessonGeneration from './components/LessonGeneration.jsx';
import Library from './components/Library.jsx';
import UserPreferences from './components/UserPreferences.jsx';

const API_BASE_URL = 'https://probable-dollop-779x77grw79cxqvv-3001.app.github.dev';

function App() {
  const [activeComponent, setActiveComponent] = useState('LessonGeneration');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [fromLanguage, setFromLanguage] = useState(() => localStorage.getItem('fromLanguage') || 'English');
  const [toLanguage, setToLanguage] = useState(() => localStorage.getItem('toLanguage') || 'Spanish');
  const [proficiency, setProficiency] = useState(() => localStorage.getItem('proficiency') || 'Beginner');
  const [savedLessons, setSavedLessons] = useState([]);
  
  // --- NEW: State for managing selected lessons for deletion ---
  const [selectedLessons, setSelectedLessons] = useState([]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/lessons`);
      setSavedLessons(response.data);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);
  
  // Effects to save preferences
  useEffect(() => { localStorage.setItem('theme', theme); document.body.className = theme === 'dark' ? 'dark-theme' : ''; }, [theme]);
  useEffect(() => { localStorage.setItem('fromLanguage', fromLanguage); }, [fromLanguage]);
  useEffect(() => { localStorage.setItem('toLanguage', toLanguage); }, [toLanguage]);
  useEffect(() => { localStorage.setItem('proficiency', proficiency); }, [proficiency]);

  const saveLesson = async (lessonToSave) => {
    try {
      await axios.post(`${API_BASE_URL}/api/lessons`, lessonToSave);
      await fetchLessons();
      setActiveComponent('Library'); 
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }
  };
  
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  const renderComponent = () => {
    switch (activeComponent) {
      case 'LessonGeneration':
        return <LessonGeneration saveLesson={saveLesson} />;
      case 'Library':
        // Pass down selection state and management functions
        return (
          <Library
            savedLessons={savedLessons}
            fetchLessons={fetchLessons}
            selectedLessons={selectedLessons}
            setSelectedLessons={setSelectedLessons}
          />
        );
      case 'UserPreferences':
        return ( <UserPreferences theme={theme} toggleTheme={toggleTheme} fromLanguage={fromLanguage} setFromLanguage={setFromLanguage} toLanguage={toLanguage} setToLanguage={setToLanguage} proficiency={proficiency} setProficiency={setProficiency} /> );
      default:
        return <LessonGeneration />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Linguaverse</h1>
        <nav>
          <button onClick={() => setActiveComponent('LessonGeneration')}>Lesson Generation</button>
          <button onClick={() => setActiveComponent('Library')}>Library</button>
          <button onClick={() => setActiveComponent('UserPreferences')}>User Preferences</button>
        </nav>
      </header>
      <main>
        {renderComponent()}
      </main>
    </div>
  );
}

export default App;