import React, { useState } from 'react';
import './App.css';

// Import our new, separate component files
import LessonGeneration from './components/LessonGeneration.jsx';
import Library from './components/Library.jsx';
import UserPreferences from './components/UserPreferences.jsx';


function App() {
  const [activeComponent, setActiveComponent] = useState('LessonGeneration');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'LessonGeneration':
        return <LessonGeneration />;
      case 'Library':
        return <Library />;
      case 'UserPreferences':
        return <UserPreferences />;
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