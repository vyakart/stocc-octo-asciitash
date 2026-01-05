/**
 * Audio parameter mapping utilities
 * Maps visual coordinates to musical parameters
 */

/**
 * Convert grid X position to MIDI note number
 * Range: C3 (48) to C6 (84)
 */
export const xToMidiNote = (x, width) => {
  const minNote = 48; // C3
  const maxNote = 84; // C6
  const normalized = x / width;
  return Math.floor(minNote + normalized * (maxNote - minNote));
};

/**
 * Convert MIDI note to frequency (Hz)
 */
export const midiToFrequency = (midiNote) => {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
};

/**
 * Convert grid Y position to note duration
 * Range: 0.1s to 0.5s
 */
export const yToDuration = (y, height) => {
  const minDuration = 0.1;
  const maxDuration = 0.5;
  const normalized = y / height;
  return minDuration + normalized * (maxDuration - minDuration);
};

/**
 * Pattern-based chord mappings
 */
const CHORDS = {
  balance: ['C4', 'E4', 'G4'],       // C major
  duality: ['D4', 'F4', 'A4'],       // D minor
  flow: ['E4', 'G4', 'B4'],          // E minor
  chaos: ['F4', 'A4', 'C5'],         // F major
  conway: ['G4', 'B4', 'D5']         // G major
};

/**
 * Get chord for pattern type
 */
export const getChordForPattern = (patternIndex) => {
  const patternNames = ['balance', 'duality', 'flow', 'chaos', 'conway'];
  return CHORDS[patternNames[patternIndex]] || CHORDS.balance;
};

/**
 * Create a scale from a given root note
 * Returns pentatonic scale for melodic playing
 */
export const getPentatonicScale = (rootMidi) => {
  // Major pentatonic intervals: 0, 2, 4, 7, 9
  return [
    rootMidi,
    rootMidi + 2,
    rootMidi + 4,
    rootMidi + 7,
    rootMidi + 9,
    rootMidi + 12
  ];
};

/**
 * Quantize a MIDI note to nearest note in scale
 */
export const quantizeToScale = (midiNote, scale) => {
  let closest = scale[0];
  let minDiff = Math.abs(midiNote - closest);

  for (const note of scale) {
    const diff = Math.abs(midiNote - note);
    if (diff < minDiff) {
      minDiff = diff;
      closest = note;
    }
  }

  return closest;
};

/**
 * Map population density to ambient volume
 * For Conway's Game of Life
 */
export const densityToVolume = (density) => {
  // density is 0-1, map to -40dB to -10dB
  const minDb = -40;
  const maxDb = -10;
  return minDb + density * (maxDb - minDb);
};
