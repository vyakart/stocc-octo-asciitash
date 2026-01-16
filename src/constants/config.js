/**
 * Application configuration constants
 */

export const CONFIG = {
  // Visual settings
  GRID_WIDTH: 60,
  GRID_HEIGHT: 35,
  SLOWDOWN_FACTOR: 12, // Animation speed (higher = slower)
  FONT_SIZE: '12px',
  BACKGROUND_COLOR: '#F0EEE6',
  TEXT_COLOR: '#1a1a1a',

  // Audio settings
  NOTE_RANGE: [48, 84], // MIDI note range (C3-C6)
  MIN_NOTE_DURATION: 0.1,
  MAX_NOTE_DURATION: 0.5,
  NOTE_THROTTLE: 50, // Milliseconds between notes
  NOISE_VOLUME: -20, // dB
  CHORD_DURATION: 0.5, // Seconds

  // Synth envelope
  ENVELOPE: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.3,
    release: 0.8
  },

  // Pattern types
  PATTERN_TYPES: {
    BALANCE: 0,
    DUALITY: 1,
    FLOW: 2,
    CHAOS: 3
  }
};
