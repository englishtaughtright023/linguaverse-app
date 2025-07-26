import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreativeStudio from './components/CreativeStudio.jsx';
import LessonView from './components/LessonView.jsx';
import UserPreferences from './components/UserPreferences.jsx';
import './App.css';

// ==================================================================
// CORRECTION: Using the public Forwarded Address for the backend
// ==================================================================
const API_BASE_URL = 'https://probable-dollop-779x77grw79cxqvv-3001.app.github.dev';

function App() {
  const [view, setView] = useState('studio');
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userTokens, setUserTokens] = useState(100);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [proficiency, setProficiency] = useState(() => localStorage.getItem('proficiency') || 'Intermediate');

  useEffect(() => {
    document.body.className = '';
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    }
  }, [theme]);

  const viewLesson = (lesson) => {
    setCurrentLesson(lesson);
    setView('lesson');
  };

  const returnToStudio = () => {
    setCurrentLesson(null);
    setView('studio');
  };

  const renderView = () => {
    switch (view) {
      case 'lesson':
        return <LessonView lesson={currentLesson} returnToStudio={returnToStudio} />;
      case 'preferences':
        return <UserPreferences />;
      case 'studio':
      default:
        return <CreativeStudio viewLesson={viewLesson} userTokens={userTokens} setUserTokens={setUserTokens} API_BASE_URL={API_BASE_URL} />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="header-title">LINGUAVERSE</h1>
        <nav className="header-nav">
          <button onClick={returnToStudio} disabled={view === 'studio'}>Creative Studio</button>
          <button onClick={() => setView('preferences')} disabled={view === 'preferences'}>Preferences</button>
        </nav>
        <div className="token-display">
          TOKENS: {userTokens}
        </div>
      </header>
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
