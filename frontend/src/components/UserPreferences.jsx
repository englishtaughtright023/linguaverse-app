import React from 'react';

// The component now receives props from App.jsx to be fully functional
function UserPreferences({
  theme,
  setTheme,
  proficiency,
  setProficiency
}) {

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleProficiencyChange = (e) => {
    const newProficiency = e.target.value;
    setProficiency(newProficiency);
    localStorage.setItem('proficiency', newProficiency);
  }

  return (
    <div className="preferences-container">
      <h2 className="gallery-title">User Preferences</h2>
      
      <div className="preferences-section">
        <h4 className="preferences-header">Proficiency</h4>
        <div className="preferences-row">
          <label htmlFor="proficiency-select">Your current proficiency level:</label>
          <select 
            id="proficiency-select" 
            className="preferences-select"
            value={proficiency} 
            onChange={handleProficiencyChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="preferences-section">
        <h4 className="preferences-header">Appearance</h4>
        <div className="preferences-row">
          <span>Current Mode: {theme === 'light' ? 'Light ☀️' : 'Dark 🌙'}</span>
          <button className="preferences-button" onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserPreferences;