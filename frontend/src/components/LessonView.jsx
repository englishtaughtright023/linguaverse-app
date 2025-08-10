import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SimulatorGame from './SimulatorGame.jsx';

const API_BASE_URL = 'https://probable-dollop-779x77grw79cxqvv-3001.app.github.dev';

function LessonView({ lesson, returnToStudio }) {
  const [activeTab, setActiveTab] = useState('description');
  
  // Speaking Tab State
  const [speakingMode, setSpeakingMode] = useState('simulator');
  const [gameStatus, setGameStatus] = useState('idle');
  const [syllableData, setSyllableData] = useState(null);

  // Writing Tab State
  const [writingAssignment, setWritingAssignment] = useState(null);
  const [isWritingLoading, setIsWritingLoading] = useState(false);
  const [writingError, setWritingError] = useState('');
  const [writingPrompt, setWritingPrompt] = useState('');
  const [userWriting, setUserWriting] = useState('');
  const [writingFeedback, setWritingFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listening Tab State
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');

  // --- NEW: State for the Feedback System ---
  const [lessonRating, setLessonRating] = useState(null); // 'good' or 'bad'
  const [showBadFeedbackOptions, setShowBadFeedbackOptions] = useState(false);


  useEffect(() => {
    const fetchWritingAssignment = async () => {
      if (activeTab === 'writing' && !writingAssignment) {
        setIsWritingLoading(true);
        setWritingError('');
        try {
          const response = await axios.post(`${API_BASE_URL}/api/writing/generate`, {
            title: lesson.title,
            situation: lesson.situation
          });
          setWritingAssignment(response.data);
        } catch (error) {
          console.error("Failed to fetch writing assignment:", error.response ? error.response.data : error.message);
          setWritingError("Could not load writing assignment from the server.");
        } finally {
          setIsWritingLoading(false);
        }
      }
    };
    fetchWritingAssignment();
  }, [activeTab, writingAssignment, lesson.title, lesson.situation]);

  useEffect(() => {
    const fetchAudio = async () => {
        if (activeTab === 'listening' && lesson.dialogue && lesson.dialogue.length > 0) {
            setIsAudioLoading(true);
            setAudioUrl(null);
            try {
                const response = await axios.post(`${API_BASE_URL}/api/tts/generate`, {
                    dialogue: lesson.dialogue,
                    voice: selectedVoice
                }, { responseType: 'blob' });
                
                const url = URL.createObjectURL(response.data);
                setAudioUrl(url);

            } catch (error) {
                console.error("Failed to fetch dialogue audio:", error);
            } finally {
                setIsAudioLoading(false);
            }
        }
    };
    fetchAudio();
  }, [activeTab, selectedVoice, lesson.dialogue]);


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

  const handleStartGame = async () => {
    const sentenceToAnalyze = lesson?.dialogue?.[0]?.sentence;
    if (!sentenceToAnalyze) {
      alert("No sample sentence available in this lesson to start the game.");
      return;
    }
    setGameStatus('loading');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/phonetics`, {
        sentence: sentenceToAnalyze
      });
      setSyllableData(response.data);
      setGameStatus('active');
    } catch (error) {
      console.error("Error fetching phonetic breakdown:", error);
      alert("Failed to retrieve phonetic data from the server.");
      setGameStatus('idle');
    }
  };

  const {
    title = "Untitled Lesson",
    heroImageUrl = "",
    chapterImageUrl = "",
    situation = "No situation description provided.",
    vocabulary = [],
    grammar = {},
    dialogue = []
  } = lesson;

  const isSimulatorReady = dialogue && dialogue.length > 0 && dialogue[0].sentence;

  const handlePromptSelection = (prompt) => {
    setWritingPrompt(prompt.text);
    setUserWriting('');
    setWritingFeedback(null);
  };
  
  const handleSubmitWriting = async () => {
      setIsSubmitting(true);
      setWritingFeedback(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/writing/feedback`, {
            prompt: writingPrompt,
            userWriting: userWriting
        });
        setWritingFeedback(response.data);
      } catch (error) {
        console.error("Failed to get writing feedback:", error);
        setWritingFeedback({
            strengths: "Could not analyze text.",
            corrections: [],
            alternatives: ["There was an error connecting to the AI tutor. Please try again."]
        });
      } finally {
        setIsSubmitting(false);
      }
  };

  // --- NEW: Handler for the feedback system ---
  const handleRating = (rating) => {
    setLessonRating(rating);
    if (rating === 'good') {
        setShowBadFeedbackOptions(false);
        // Here you would send a "good" rating to your backend.
        console.log(`Lesson ${lesson._id} rated as GOOD.`);
    } else {
        setShowBadFeedbackOptions(true);
        // Here you would send a "bad" rating to your backend.
        console.log(`Lesson ${lesson._id} rated as BAD.`);
    }
  };

  const handleBadFeedbackReason = (reason) => {
      // Here you would send the specific reason to your backend.
      console.log(`Reason for bad rating on lesson ${lesson._id}: ${reason}`);
      setShowBadFeedbackOptions(false); // Hide options after selection
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'writing':
        return (
          <div className="tab-content-container">
            <div className="writing-layout">
              <div className="writing-visual-pane">
                <h3 className="lesson-section-header">Detail Shot</h3>
                {chapterImageUrl ? (
                  <img 
                    src={chapterImageUrl} 
                    alt={`${title} - Detail Shot`} 
                    className="lesson-chapter-image"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/896x1536/0d0d1a/e0e0e0?text=Detail+Shot'; }}
                  />
                ) : (
                  <div className="image-placeholder">Generating Detail Shot...</div>
                )}
              </div>
              <div className="writing-interactive-pane">
                {isWritingLoading ? (
                  <p>Generating your writing assignment...</p>
                ) : writingAssignment ? (
                  <>
                    <div className="lesson-section">
                      <h3 className="lesson-section-header">Daydream Scenario</h3>
                      <p>{writingAssignment.daydreamScenario}</p>
                    </div>
                    
                    <div className="lesson-section">
                      <h3 className="lesson-section-header">Choose Your Prompt</h3>
                      <div className="prompt-matrix">
                        {writingAssignment.promptMatrix.map(prompt => (
                          <button key={prompt.id} onClick={() => handlePromptSelection(prompt)} className="prompt-button">
                            {prompt.text}
                          </button>
                        ))}
                      </div>
                    </div>

                    {writingPrompt && (
                      <div className="lesson-section">
                        <h3 className="lesson-section-header">Your Response</h3>
                        <p className="selected-prompt-display"><strong>Your Mission:</strong> {writingPrompt}</p>
                        <textarea
                          className="writing-input"
                          value={userWriting}
                          onChange={(e) => setUserWriting(e.target.value)}
                          placeholder="Compose your response here..."
                          disabled={isSubmitting}
                        />
                        <button onClick={handleSubmitWriting} disabled={isSubmitting || !userWriting} className="submit-writing-button">
                          {isSubmitting ? 'Analyzing...' : 'Submit for Feedback'}
                        </button>
                      </div>
                    )}

                    {writingFeedback && (
                        <div className="lesson-section feedback-section">
                            <h3 className="lesson-section-header">Tutor Feedback</h3>
                            <div className="feedback-item">
                                <strong>Strengths:</strong>
                                <p>{writingFeedback.strengths}</p>
                            </div>
                            {writingFeedback.corrections && writingFeedback.corrections.length > 0 && (
                                <div className="feedback-item">
                                    <strong>Corrections:</strong>
                                    {writingFeedback.corrections.map((c, i) => <p key={i}>Instead of "{c.original}", try "{c.suggestion}".</p>)}
                                </div>
                            )}
                            <div className="feedback-item">
                                <strong>Alternative Phrasing:</strong>
                                {writingFeedback.alternatives.map((a, i) => <p key={i}>- {a}</p>)}
                            </div>
                        </div>
                    )}
                  </>
                ) : (
                  <p className="error-message">{writingError}</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'listening':
        return (
            <div className="tab-content-container">
                <div className="lesson-section listening-control-deck">
                    <h3 className="lesson-section-header">Dialogue Playback</h3>
                    <div className="voice-selector-container">
                        <label htmlFor="voice-select">Select Accent / Voice:</label>
                        <select 
                            id="voice-select" 
                            className="preferences-select"
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            disabled={isAudioLoading}
                        >
                            <option value="alloy">Alloy (Standard American)</option>
                            <option value="echo">Echo (Standard American)</option>
                            <option value="fable">Fable (British RP)</option>
                            <option value="onyx">Onyx (Standard American)</option>
                            <option value="nova">Nova (Standard American)</option>
                            <option value="shimmer">Shimmer (British RP)</option>
                            <option value="ozzy-fier" disabled>Ozzy-fier (Experimental)</option>
                        </select>
                    </div>

                    {isAudioLoading && <p>Synthesizing audio...</p>}
                    
                    {audioUrl && (
                        <audio controls src={audioUrl} className="dialogue-audio-player">
                            Your browser does not support the audio element.
                        </audio>
                    )}

                    {!isAudioLoading && !audioUrl && (
                        <p className="error-message">Audio could not be generated. This lesson may not contain dialogue.</p>
                    )}
                </div>
            </div>
        );
      case 'speaking':
        return (
            <div className="tab-content-container">
                <div className="speaking-mode-toggle">
                    <button 
                        className={`speaking-mode-button ${speakingMode === 'simulator' ? 'active' : ''}`}
                        onClick={() => setSpeakingMode('simulator')}
                    >
                        Simulator
                    </button>
                    <button 
                        className={`speaking-mode-button ${speakingMode === 'conversation' ? 'active' : ''}`}
                        onClick={() => setSpeakingMode('conversation')}
                    >
                        Conversation
                    </button>
                </div>
                <div className="speaking-content-area">
                    {speakingMode === 'simulator' ? (
                        <div>
                            {!isSimulatorReady ? (
                              <p className="error-message">This lesson does not contain dialogue data required for the Simulator.</p>
                            ) : (
                              <>
                                {gameStatus === 'idle' && (
                                    <button onClick={handleStartGame} className="start-game-button">
                                        Begin Phonetic Analysis
                                    </button>
                                )}
                                {gameStatus === 'loading' && <p>Analyzing sentence...</p>}
                                {gameStatus === 'active' && (
                                    <SimulatorGame 
                                      syllableData={syllableData} 
                                      onGameFinish={() => setGameStatus('idle')} 
                                    />
                                )}
                              </>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 className="lesson-section-header">Conversation Engine</h3>
                            <p>The "Inquisitor" dialogue system will be implemented here.</p>
                        </div>
                    )}
                </div>
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
      <div className="lesson-tabs">
        <button className={`lesson-tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Picture</button>
        <button className={`lesson-tab ${activeTab === 'writing' ? 'active' : ''}`} onClick={() => setActiveTab('writing')}>Writing</button>
        <button className={`lesson-tab ${activeTab === 'listening' ? 'active' : ''}`} onClick={() => setActiveTab('listening')}>Listening</button>
        <button className={`lesson-tab ${activeTab === 'speaking' ? 'active' : ''}`} onClick={() => setActiveTab('speaking')}>Speaking</button>
        <button className={`lesson-tab ${activeTab === 'vocabulary' ? 'active' : ''}`} onClick={() => setActiveTab('vocabulary')}>Vocabulary</button>
      </div>
      
      <div className="lesson-tab-content">
        {renderTabContent()}
      </div>

      {/* --- NEW: Diagnostic Feedback Section --- */}
      <div className="lesson-feedback-container">
        <h3 className="feedback-header">Rate This Lesson</h3>
        {lessonRating ? (
            <p className="feedback-thank-you">Thank you for your feedback!</p>
        ) : (
            <div className="feedback-buttons">
                <button onClick={() => handleRating('good')} className="feedback-button thumbs-up">👍</button>
                <button onClick={() => handleRating('bad')} className="feedback-button thumbs-down">👎</button>
            </div>
        )}
        
        {showBadFeedbackOptions && (
            <div className="bad-feedback-options">
                <p>What was suboptimal?</p>
                <button onClick={() => handleBadFeedbackReason('picture')}>Picture</button>
                <button onClick={() => handleBadFeedbackReason('writing')}>Writing</button>
                <button onClick={() => handleBadFeedbackReason('listening')}>Listening</button>
                <button onClick={() => handleBadFeedbackReason('speaking')}>Speaking</button>
            </div>
        )}
      </div>
      {/* --- END --- */}
    </div>
  );
}

export default LessonView;
