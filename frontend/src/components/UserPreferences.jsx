// -----------------------------------------------------------------------------
// FILE: frontend/src/components/UserPreferences.jsx (Final Refit)
// -----------------------------------------------------------------------------
// This version has been updated to use the new CSS class for centering
// and to be a self-contained component for now.
// -----------------------------------------------------------------------------
import React from 'react';

function UserPreferences() {
  // Mock data for now - this would be hooked into App.jsx state later
  const theme = 'dark';
  const toggleTheme = () => console.log("Toggle theme");
  const fromLanguage = 'English';
  const toLanguage = 'Spanish';
  const proficiency = 'Intermediate';

  return (
    <div className="preferences-view">
      <h2>User Preferences</h2>
      
      <div className="preferences-content">
        <div className="lesson-section">
          <h4>Language Settings</h4>
          <label>
            Your primary language:
            <select value={fromLanguage} onChange={() => {}}>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </select>
          </label>
          <label>
            Language you want to learn:
            <select value={toLanguage} onChange={() => {}}>
              <option value="Spanish">Spanish</option>
              <option value="English">English</option>
            </select>
          </label>
        </div>

        <div className="lesson-section">
          <h4>Proficiency</h4>
          <label>
            Your current proficiency level:
            <select value={proficiency} onChange={() => {}}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>
        </div>

        <div className="lesson-section">
          <h4>Appearance</h4>
          <p>Current Mode: {theme === 'light' ? 'Light ☀️' : 'Dark 🌙'}</p>
          <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserPreferences;
