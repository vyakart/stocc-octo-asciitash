import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import './App.css';
import { patterns, valueToASCII, PATTERN_NAMES } from './utils/patterns';
import {
  initializeConwayGrid,
  updateConway,
  toggleCell,
  conwayToASCII
} from './utils/conway';
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

  // Conway-specific state
  const [conwayGrid, setConwayGrid] = useState(() =>
    initializeConwayGrid(CONFIG.GRID_WIDTH, CONFIG.GRID_HEIGHT)
  );

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

  // Handle Conway cell births (for audio)
  const handleCellBirths = useCallback((birthPositions) => {
    if (!audioStarted || !synthRef.current || birthPositions.length === 0) return;

    // Play a note for each birth (max 5 per frame to prevent audio overload)
    const positions = birthPositions.slice(0, 5);
    positions.forEach((pos, idx) => {
      setTimeout(() => {
        playNote(pos.x, pos.y);
      }, idx * 20); // Slight delay between notes
    });
  }, [audioStarted, playNote]);

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
  const handleClick = async (e) => {
    await initAudio();

    if (patternType === CONFIG.PATTERN_TYPES.CONWAY) {
      // Toggle cell in Conway mode
      const gridPos = screenToGrid(e.clientX, e.clientY);
      if (gridPos) {
        setConwayGrid(prevGrid => toggleCell(prevGrid, gridPos.x, gridPos.y));
      }
    } else {
      // Change pattern in mathematical modes
      const nextPattern = (patternType + 1) % PATTERN_NAMES.length;
      setPatternType(nextPattern);
      playChord();
    }
  };

  const handleMouseDown = async (e) => {
    await initAudio();
    setMouseDown(true);

    const gridPos = screenToGrid(e.clientX, e.clientY);
    if (gridPos) {
      setMousePos(gridPos);
      playNote(gridPos.x, gridPos.y);

      // Start noise generator
      if (noiseRef.current && patternType !== CONFIG.PATTERN_TYPES.CONWAY) {
        noiseRef.current.start();
      }
    }
  };

  const handleMouseMove = (e) => {
    const gridPos = screenToGrid(e.clientX, e.clientY);
    if (gridPos) {
      setMousePos(gridPos);

      if (mouseDown && patternType !== CONFIG.PATTERN_TYPES.CONWAY) {
        playNote(gridPos.x, gridPos.y);
      }
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);

    // Stop noise generator
    if (noiseRef.current && patternType !== CONFIG.PATTERN_TYPES.CONWAY) {
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
        case 'r':
          if (patternType === CONFIG.PATTERN_TYPES.CONWAY) {
            setConwayGrid(initializeConwayGrid(CONFIG.GRID_WIDTH, CONFIG.GRID_HEIGHT));
          }
          break;
        case 'c':
          if (patternType === CONFIG.PATTERN_TYPES.CONWAY) {
            setConwayGrid(initializeConwayGrid(CONFIG.GRID_WIDTH, CONFIG.GRID_HEIGHT));
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
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
  }, [patternType, audioStarted]);

  // Render pattern
  const renderPattern = () => {
    if (patternType === CONFIG.PATTERN_TYPES.CONWAY) {
      // Render Conway's Game of Life
      return conwayToASCII(conwayGrid);
    } else {
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
    }
  };

  // Animation loop
  useEffect(() => {
    if (isPaused) return;

    const animate = () => {
      setFrame(prev => (prev + 1) % 2880);

      // Update Conway grid periodically
      if (patternType === CONFIG.PATTERN_TYPES.CONWAY &&
          frame % CONFIG.CONWAY_UPDATE_INTERVAL === 0) {
        setConwayGrid(prevGrid => {
          const { nextGrid, birthPositions } = updateConway(prevGrid);
          handleCellBirths(birthPositions);
          return nextGrid;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frame, patternType, isPaused]);

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
            {patternType === CONFIG.PATTERN_TYPES.CONWAY
              ? 'Click to toggle cells | Space: pause | R: randomize'
              : 'Click to change pattern | Drag to play | Keys 1-5: select pattern'}
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
