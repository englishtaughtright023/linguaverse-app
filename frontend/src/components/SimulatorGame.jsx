import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://probable-dollop-779x77grw79cxqvv-3001.app.github.dev';
const SCROLL_SPEED = 150; // Pixels per second

function SimulatorGame({ syllableData, onGameFinish }) {
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [judgement, setJudgement] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [isRecording, setIsRecording] = useState(false);

  const gameTimeRef = useRef(0);
  const animationFrameRef = useRef();
  const trackRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const noteTimelineRef = useRef([]);
  const currentNoteIndexRef = useRef(0);

  // Get mic permission once
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setPermissionStatus('granted');
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          sendAudioToServer(audioBlob, currentNoteIndexRef.current - 1); // Score the note that just finished
          audioChunksRef.current = [];
        };
      })
      .catch(err => setPermissionStatus('denied'));
  }, []);

  // Effect to build the note timeline when data is ready
  useEffect(() => {
    if (!syllableData) return;
    let currentTime = 2000; // 2-second lead-in
    const notes = [];
    syllableData.forEach(word => {
      word.syllables.forEach(syllable => {
        notes.push({ ...syllable, time: currentTime, hit: false });
        currentTime += syllable.duration;
      });
    });
    noteTimelineRef.current = notes;
  }, [syllableData]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();
    const animate = (now) => {
      const deltaTime = now - lastTime;
      lastTime = now;
      gameTimeRef.current += deltaTime;

      // Scroll the track
      if (trackRef.current) {
        trackRef.current.style.transform = `translateY(${gameTimeRef.current * (SCROLL_SPEED / 1000)}px)`;
      }

      // Check for active note
      const upcomingNote = noteTimelineRef.current[currentNoteIndexRef.current];
      if (upcomingNote && gameTimeRef.current >= upcomingNote.time) {
        if (upcomingNote.text !== "") { // Don't record for pauses
            if (mediaRecorderRef.current?.state === 'inactive') {
                mediaRecorderRef.current.start();
                setIsRecording(true);
            }
            // Schedule the stop
            setTimeout(() => {
                if (mediaRecorderRef.current?.state === 'recording') {
                    mediaRecorderRef.current.stop();
                    setIsRecording(false);
                }
            }, upcomingNote.duration);
        }
        currentNoteIndexRef.current++;
      }
      
      // End game condition
      if(gameTimeRef.current > (noteTimelineRef.current[noteTimelineRef.current.length - 1]?.time || 0) + 2000) {
        setGameState('finished');
        onGameFinish();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState, onGameFinish]);

  const sendAudioToServer = async (audioBlob, indexToScore) => {
    if (indexToScore < 0) return;
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/speech/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const targetText = noteTimelineRef.current[indexToScore].text.toLowerCase().trim().replace(/[.,!?;]/g, '');
      const spokenText = response.data.transcription.toLowerCase().trim().replace(/[.,!?;]/g, '');

      if (spokenText.includes(targetText) && targetText !== "") {
        setJudgement('Perfect!');
        setScore(prev => prev + 100 + combo * 10);
        setCombo(prev => prev + 1);
      } else {
        setJudgement('Miss');
        setCombo(0);
      }
    } catch (error) {
      console.error("Error sending audio to server:", error);
      setJudgement('Error');
      setCombo(0);
    }
  };

  const startGame = () => {
    gameTimeRef.current = 0;
    currentNoteIndexRef.current = 0;
    setScore(0);
    setCombo(0);
    setJudgement('');
    setGameState('playing');
  };

  return (
    <div className="simulator-container">
      <div className="full-sentence-display">
        {syllableData.map(word => word.syllables.map(s => s.text).join('')).join(' ')}
      </div>
      <div className="simulator-game-board">
        {gameState === 'ready' && (
          <div className="start-overlay">
            <button onClick={startGame} disabled={permissionStatus !== 'granted'}>
              {permissionStatus === 'granted' ? 'START' : 'MIC REQUIRED'}
            </button>
          </div>
        )}

        <div className="game-feedback-display">
          <div className="score">SCORE: {score}</div>
          <div className={`judgement ${judgement.toLowerCase()}`}>{judgement}</div>
          <div className="combo">{combo > 1 ? `COMBO x${combo}`: ''}</div>
        </div>
        
        <div className="note-highway">
          <div className="note-track" ref={trackRef}>
            {noteTimelineRef.current.map((note, index) => {
              const yPos = note.time * (SCROLL_SPEED / 1000);
              const isPause = note.text === "";
              return (
                <div
                  key={index}
                  className={`syllable-note ${isPause ? 'pause' : ''}`}
                  style={{ bottom: `${yPos}px` }}
                >
                  {!isPause && note.text}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="hit-zone-v2">
            <div className={`recording-indicator ${isRecording ? 'active' : ''}`}></div>
        </div>
      </div>
    </div>
  );
}

export default SimulatorGame;

