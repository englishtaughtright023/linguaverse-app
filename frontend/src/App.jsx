import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreativeStudio from './components/CreativeStudio.jsx';
import LessonView from './components/LessonView.jsx';
import UserPreferences from './components/UserPreferences.jsx';
import MyCreations from './components/MyCreations.jsx';
import './App.css';

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
    // When returning from a lesson, we set the view to 'creations'
    // This makes the workflow more intuitive.
    setView('creations');
  };

  const renderView = () => {
    switch (view) {
      case 'lesson':
        return <LessonView lesson={currentLesson} returnToStudio={returnToStudio} />;
      case 'preferences':
        return <UserPreferences 
                  theme={theme}
                  setTheme={setTheme}
                  proficiency={proficiency}
                  setProficiency={setProficiency}
               />;
      case 'creations':
        // --- PASSING 'currentLesson' PROP ---
        return <MyCreations 
                  viewLesson={viewLesson} 
                  API_BASE_URL={API_BASE_URL} 
                  currentLesson={currentLesson} 
               />;
      case 'studio':
      default:
        return <CreativeStudio viewLesson={viewLesson} userTokens={userTokens} setUserTokens={setUserTokens} API_BASE_URL={API_BASE_URL} proficiency={proficiency} />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header-stacked">
        <img src="/logo.png" alt="Linguaverse Logo" className="header-logo" />
        <div className="header-controls">
          <nav className="header-nav">
            <button onClick={() => setView('studio')} disabled={view === 'studio'}>Creative Studio</button>
            <button onClick={() => setView('creations')} disabled={view === 'creations'}>My Creations</button>
            <button onClick={() => setView('preferences')} disabled={view === 'preferences'}>Preferences</button>
          </nav>
          <div className="token-display">
            TOKENS: {userTokens}
          </div>
        </div>
      </header>
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
