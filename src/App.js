import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import './App.css';
import { patterns, valueToASCII, PATTERN_NAMES } from './utils/patterns';
import {
  xToMidiNote,
  midiToFrequency,
  yToDuration,
  getChordForPattern
} from './utils/audioMapping';
import { CONFIG } from './constants/config';

function App() {
  // State management
  const [frame, setFrame] = useState(0);
  const [patternType, setPatternType] = useState(0);
  const [mousePos, setMousePos] = useState(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for audio and DOM
  const synthRef = useRef(null);
  const noiseRef = useRef(null);
  const containerRef = useRef(null);
  const lastNoteTimeRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Initialize audio context
  const initAudio = async () => {
    if (audioStarted) return;

    await Tone.start();

    // Create PolySynth for melodic notes
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: CONFIG.ENVELOPE
    }).toDestination();

    // Create Noise generator for texture
    noiseRef.current = new Tone.Noise({
      type: 'pink',
      volume: CONFIG.NOISE_VOLUME
    }).toDestination();

    setAudioStarted(true);
  };

  // Play a note at given position
  const playNote = useCallback((x, y) => {
    if (!audioStarted || !synthRef.current) return;

    const now = Date.now();
    if (now - lastNoteTimeRef.current < CONFIG.NOTE_THROTTLE) return;

    const midiNote = xToMidiNote(x, CONFIG.GRID_WIDTH);
    const frequency = midiToFrequency(midiNote);
    const duration = yToDuration(y, CONFIG.GRID_HEIGHT);

    synthRef.current.triggerAttackRelease(frequency, duration);
    lastNoteTimeRef.current = now;
  }, [audioStarted]);

  // Play chord for pattern change
  const playChord = useCallback(() => {
    if (!audioStarted || !synthRef.current) return;

    const chord = getChordForPattern(patternType);
    synthRef.current.triggerAttackRelease(chord, CONFIG.CHORD_DURATION);
  }, [audioStarted, patternType]);

  // Convert screen coordinates to grid coordinates
  const screenToGrid = (clientX, clientY) => {
    if (!containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const charWidth = rect.width / CONFIG.GRID_WIDTH;
    const charHeight = rect.height / CONFIG.GRID_HEIGHT;

    const gridX = Math.floor(x / charWidth);
    const gridY = Math.floor(y / charHeight);

    return {
      x: Math.max(0, Math.min(CONFIG.GRID_WIDTH - 1, gridX)),
      y: Math.max(0, Math.min(CONFIG.GRID_HEIGHT - 1, gridY))
    };
  };

  // Event handlers
  const handleClick = async () => {
    await initAudio();

    // Change pattern
    const nextPattern = (patternType + 1) % PATTERN_NAMES.length;
    setPatternType(nextPattern);
    playChord();
  };

  const handleMouseDown = async (e) => {
    await initAudio();
    setMouseDown(true);

    const gridPos = screenToGrid(e.clientX, e.clientY);
    if (gridPos) {
      setMousePos(gridPos);
      playNote(gridPos.x, gridPos.y);

      // Start noise generator
      if (noiseRef.current) {
        noiseRef.current.start();
      }
    }
  };

  const handleMouseMove = (e) => {
    const gridPos = screenToGrid(e.clientX, e.clientY);
    if (gridPos) {
      setMousePos(gridPos);

      if (mouseDown) {
        playNote(gridPos.x, gridPos.y);
      }
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);

    // Stop noise generator
    if (noiseRef.current) {
      noiseRef.current.stop('+0.2');
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          const index = parseInt(e.key) - 1;
          if (index >= 0 && index < PATTERN_NAMES.length) {
            setPatternType(index);
            playChord();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [audioStarted, playChord]);

  // Render pattern
  const renderPattern = () => {
    // Render mathematical pattern
    const patternNames = ['balance', 'duality', 'flow', 'chaos'];
    const patternFunc = patterns[patternNames[patternType]];

    let output = '';
    const t = frame / CONFIG.SLOWDOWN_FACTOR;

    for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
      for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
        const value = patternFunc(
          x,
          y,
          t,
          CONFIG.GRID_WIDTH,
          CONFIG.GRID_HEIGHT,
          mouseDown ? mousePos : null
        );
        output += valueToASCII(value);
      }
      output += '\n';
    }

    return output;
  };

  // Animation loop
  useEffect(() => {
    if (isPaused) return;

    const animate = () => {
      setFrame(prev => (prev + 1) % 2880);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frame, isPaused]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.dispose();
      if (noiseRef.current) noiseRef.current.dispose();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ASCII Audio Visualizer</h1>
        <div className="controls">
          <span className="pattern-name">{PATTERN_NAMES[patternType]}</span>
          <span className="hint">
            Click to change pattern | Drag to play | Keys 1-4: select pattern | Space: pause
          </span>
          {!audioStarted && (
            <span className="audio-notice">Click anywhere to start audio</span>
          )}
          {isPaused && <span className="paused-indicator">PAUSED</span>}
        </div>
      </header>

      <main
        ref={containerRef}
        className="visualizer"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <pre className="pattern-output">{renderPattern()}</pre>
      </main>

      <footer className="App-footer">
        <p>Pattern: {patternType + 1} of {PATTERN_NAMES.length} | Frame: {frame}</p>
      </footer>
    </div>
  );
}

export default App;
