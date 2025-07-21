import React, { useState, useEffect } from 'react';
import axios from 'axios'; // We need axios for API calls
import './App.css';
import LessonGeneration from './components/LessonGeneration.jsx';
import Library from './components/Library.jsx';
import UserPreferences from './components/UserPreferences.jsx';

// Define the base URL for your backend API
const API_BASE_URL = 'https://probable-dollop-779x77grw79cxqvv-3001.app.github.dev';

function App() {
  const [activeComponent, setActiveComponent] = useState('LessonGeneration');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // --- START: New Database-Driven Lesson State ---
  const [savedLessons, setSavedLessons] = useState([]);

  // Function to fetch all lessons from the database
  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/lessons`);
      setSavedLessons(response.data);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    }
  };

  // useEffect to fetch lessons when the app first loads
  useEffect(() => {
    fetchLessons();
  }, []); // The empty dependency array ensures this runs only once on mount

  // Function to save a new lesson to the database
  const saveLesson = async (lessonToSave) => {
    try {
      await axios.post(`${API_BASE_URL}/api/lessons`, lessonToSave);
      // After saving, re-fetch all lessons to update the library with the new data
      await fetchLessons();
      // Navigate to the library to show the user it was saved
      setActiveComponent('Library'); 
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }
  };
  // --- END: New Database-Driven Lesson State ---

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'LessonGeneration':
        return <LessonGeneration saveLesson={saveLesson} />;
      case 'Library':
        return <Library savedLessons={savedLessons} />;
      case 'UserPreferences':
        return <UserPreferences theme={theme} toggleTheme={toggleTheme} />;
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