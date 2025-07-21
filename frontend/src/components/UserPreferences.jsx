import React from 'react';

function UserPreferences({ theme, toggleTheme }) {
  return (
    <div>
      <h2>User Preferences</h2>
      <div className="lesson-section">
        <h4>Appearance</h4>
        <p>Current Mode: {theme === 'light' ? 'Light ☀️' : 'Dark 🌙'}</p>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
      {/* Future preference sections will be added here */}
    </div>
  );
}

export default UserPreferences;