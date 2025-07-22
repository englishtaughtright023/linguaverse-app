import React from 'react';

function UserPreferences({
  theme,
  toggleTheme,
  fromLanguage,
  setFromLanguage,
  toLanguage,
  setToLanguage,
  proficiency,
  setProficiency
}) {
  return (
    <div>
      <h2>User Preferences</h2>
      
      <div className="lesson" style={{ maxWidth: '500px', textAlign: 'left' }}>
        <div className="lesson-section">
          <h4>Language Settings</h4>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Your primary language:
            <select
              value={fromLanguage}
              onChange={(e) => setFromLanguage(e.target.value)}
              style={{ width: '100%', marginTop: '5px' }}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Language you want to learn:
            <select
              value={toLanguage}
              onChange={(e) => setToLanguage(e.target.value)}
              style={{ width: '100%', marginTop: '5px' }}
            >
              <option value="Spanish">Spanish</option>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </label>
        </div>

        <div className="lesson-section">
          <h4>Proficiency</h4>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Your current proficiency level:
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              style={{ width: '100%', marginTop: '5px' }}
            >
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