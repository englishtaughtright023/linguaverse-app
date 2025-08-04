import React, { useState } from 'react';

function LessonView({ lesson, returnToStudio }) {
  // State to manage which tab is currently active
  const [activeTab, setActiveTab] = useState('description');

  if (!lesson) {
    return (
      <div className="lesson-view-container">
        <h2 className="error-message">Error: Lesson data is unavailable.</h2>
        <button className="lesson-back-button" onClick={returnToStudio}>
          &larr; Back
        </button>
      </div>
    );
  }

  const {
    title = "Untitled Lesson",
    heroImageUrl = "",
    chapterImageUrl = "",
    situation = "No situation description provided.",
    vocabulary = [],
    grammar = {},
    dialogue = []
  } = lesson;

  // Function to render the content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'writing':
        return (
          <div className="tab-content-container">
            <div className="tab-content-writing">
              <img 
                src={chapterImageUrl} 
                alt={`${title} - Chapter Image`} 
                className="lesson-chapter-image"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/896x1536/0d0d1a/e0e0e0?text=Chapter+Image'; }}
              />
              <div className="lesson-section">
                <h3 className="lesson-section-header">Writing Prompt</h3>
                <p>Writing prompts and exercises based on the lesson will appear here in a future update.</p>
              </div>
            </div>
          </div>
        );
      case 'listening':
        return (
            <div className="tab-content-container">
                <p>Listening exercises and audio controls for the dialogue and vocabulary will appear here.</p>
            </div>
        );
      case 'speaking':
        return (
            <div className="tab-content-container">
                <p>Speaking practice with voice recognition will appear here.</p>
            </div>
        );
      case 'vocabulary':
        return (
          <div className="tab-content-container">
            <div className="lesson-section">
                <h3 className="lesson-section-header">Vocabulary Index</h3>
                <ul className="vocab-list">
                    {Array.isArray(vocabulary) && vocabulary.length > 0 ? (
                    vocabulary.map((item, index) => (
                        item && item.word && item.translation ? (
                        <li key={index} className="vocab-item">
                            <span className="vocab-term">{item.word}</span>
                            <span className="vocab-definition">{item.translation}</span>
                        </li>
                        ) : null
                    ))
                    ) : (
                    <p>Vocabulary not available for this lesson.</p>
                    )}
                </ul>
            </div>
          </div>
        );
      case 'description':
      default:
        return (
          <div className="tab-content-container">
            <img 
              src={heroImageUrl} 
              alt={title} 
              className="lesson-hero-image"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1600x900/0d0d1a/e0e0e0?text=Hero+Image'; }}
            />
            <div className="lesson-section">
                <h3 className="lesson-section-header">Picture Description</h3>
                <p>{situation}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="lesson-view-container">
      <h1 className="lesson-main-title">{title}</h1>
      <button className="lesson-back-button" onClick={returnToStudio}>
        &larr; Back to Arcade
      </button>

      {/* --- TAB NAVIGATION --- */}
      <div className="lesson-tabs">
        <button className={`lesson-tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Picture</button>
        <button className={`lesson-tab ${activeTab === 'writing' ? 'active' : ''}`} onClick={() => setActiveTab('writing')}>Writing</button>
        <button className={`lesson-tab ${activeTab === 'listening' ? 'active' : ''}`} onClick={() => setActiveTab('listening')}>Listening</button>
        <button className={`lesson-tab ${activeTab === 'speaking' ? 'active' : ''}`} onClick={() => setActiveTab('speaking')}>Speaking</button>
        <button className={`lesson-tab ${activeTab === 'vocabulary' ? 'active' : ''}`} onClick={() => setActiveTab('vocabulary')}>Vocabulary</button>
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className="lesson-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default LessonView;
