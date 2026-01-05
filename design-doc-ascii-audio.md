# ASCII Audio Visualizer - Design Document

## Project Overview

**Project Name:** ASCII Audio Visualizer  
**Version:** 1.0.0  
**Last Updated:** January 2026

### Vision
An interactive audiovisual instrument that transforms mathematical patterns into ASCII art while generating musical soundscapes. Users can paint with sound, creating a synesthetic experience where every movement produces both visual and auditory feedback.

### Core Philosophy
- **Generative**: Patterns emerge from mathematical algorithms, never repeating exactly
- **Interactive**: User input directly influences both visuals and audio
- **Accessible**: Built with web technologies, runs anywhere
- **Expressive**: Simple interactions produce complex, beautiful results

---

## Technical Stack

### Frontend
- **React 18+**: Component-based UI architecture
- **Tone.js**: Web Audio API wrapper for sound synthesis
- **JavaScript/ES6+**: Core logic and rendering

### Development Tools
- **Create React App**: Build tooling and development server
- **Git/GitHub**: Version control and collaboration
- **GitHub Pages**: Deployment and hosting

### Browser Requirements
- Modern browsers with Web Audio API support (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Mouse/trackpad for interaction

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────┐
│           User Interaction Layer            │
│  (Mouse events, clicks, drags, keyboard)    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         React Component Layer               │
│  - State Management (useState, useRef)      │
│  - Event Handlers                           │
│  - Rendering Logic                          │
└─────┬───────────────────────────┬───────────┘
      │                           │
┌─────▼──────────────┐   ┌────────▼──────────┐
│  Visual Engine     │   │   Audio Engine    │
│  - Pattern Math    │   │   - Tone.js       │
│  - ASCII Mapping   │   │   - Synthesizers  │
│  - Animation Loop  │   │   - Effects       │
└────────────────────┘   └───────────────────┘
```

### File Structure

```
ascii-audio-visualizer/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js                 # Main component
│   ├── index.js               # Entry point
│   ├── index.css              # Global styles
│   ├── components/            # Future modular components
│   │   ├── PatternEngine.js
│   │   ├── AudioEngine.js
│   │   └── Controls.js
│   ├── utils/                 # Utility functions
│   │   ├── patterns.js        # Pattern algorithms
│   │   └── audioMapping.js    # Audio parameter mapping
│   └── constants/             # Configuration
│       └── config.js          # App settings
├── package.json
├── README.md
├── DESIGN.md                  # This document
└── .gitignore
```

---

## Core Components

### 1. Pattern Engine

**Purpose:** Generate mathematical patterns that create visual ASCII art

**Algorithm Types:**
- **Balance**: Radial waves emanating from center point
- **Duality**: Split-screen opposing forces
- **Flow**: Circular/spiral motion patterns
- **Chaos**: Organic, pseudo-random movement
- **Conway**: Cellular automaton following Conway's Game of Life rules

**Key Functions:**
```javascript
patterns.balance(x, y, t) -> float     // Returns -1 to 1
patterns.duality(x, y, t) -> float
patterns.flow(x, y, t) -> float
patterns.chaos(x, y, t) -> float
```

**Parameters:**
- `x, y`: Coordinate position (0-width, 0-height)
- `t`: Time variable (advances with animation frame)
- Returns: Float value used for ASCII character mapping

**ASCII Mapping Table:**
```
Value Range    Character    Visual Density
> 0.8          █            Solid
0.5 to 0.8     ▓            Dense
0.2 to 0.5     ▒            Medium
-0.2 to 0.2    ░            Light
-0.5 to -0.2   ·            Sparse
< -0.5         (space)      Empty
```

### Conway's Game of Life Implementation

**Purpose:** Simulate cellular automaton with emergent patterns and glider formations

**Core Rules:**
1. Any live cell with 2-3 live neighbors survives
2. Any dead cell with exactly 3 live neighbors becomes alive
3. All other cells die or stay dead

**Grid System:**
```javascript
// 60x35 grid, each cell can be alive (1) or dead (0)
grid = Array(35).fill(null).map(() => Array(60).fill(0));
```

**Glider Patterns:**

Standard Glider (moves diagonally):
```
□ ■ □
□ □ ■
■ ■ ■
```

Lightweight Spaceship (LWSS):
```
□ ■ □ □ ■
■ □ □ □ □
■ □ □ □ ■
■ ■ ■ ■ □
```

**Initial Conditions:**
- Spawn 3-5 gliders at random positions and orientations
- Place random noise (10-15% density) for emergent patterns
- Edge wrapping: cells at borders connect to opposite side (toroidal topology)

**Update Cycle:**
```javascript
function updateConway(currentGrid) {
  const nextGrid = createEmptyGrid();
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const neighbors = countLiveNeighbors(currentGrid, x, y);
      const isAlive = currentGrid[y][x] === 1;
      
      if (isAlive && (neighbors === 2 || neighbors === 3)) {
        nextGrid[y][x] = 1; // Survive
      } else if (!isAlive && neighbors === 3) {
        nextGrid[y][x] = 1; // Birth
      }
      // else: death or stay dead (0)
    }
  }
  
  return nextGrid;
}
```

**Neighbor Counting (with wraparound):**
```javascript
function countLiveNeighbors(grid, x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const nx = (x + dx + width) % width;
      const ny = (y + dy + height) % height;
      
      if (grid[ny][nx] === 1) count++;
    }
  }
  return count;
}
```

**ASCII Mapping for Conway:**
```
Cell State    Character    Meaning
1 (alive)     █            Living cell
0 (dead)      (space)      Empty cell
```

**Audio Integration:**
- Each cell birth triggers a note (pitch based on X position)
- Glider collisions create chord progressions
- Population density controls ambient noise volume
- Stable patterns (oscillators) create rhythmic loops

**Performance Optimization:**
- Update grid every 5-10 frames (not every frame)
- Track changed regions only (dirty rectangles)
- Pre-compute neighbor offsets for wraparound

**User Interaction:**
- Click to toggle cells (alive/dead)
- Drag to draw patterns
- Spacebar to pause/resume simulation
- 'R' key to randomize grid
- 'C' key to clear and respawn gliders

### 2. Audio Engine

**Purpose:** Generate musical tones and textures from user interaction

**Components:**

**a) PolySynth (Melodic Notes)**
```javascript
oscillator: 'sine'
envelope: {
  attack: 0.02s    // Fast onset
  decay: 0.1s      // Quick decay
  sustain: 0.3     // Medium sustain level
  release: 0.8s    // Smooth release
}
```

**b) Noise Generator (Texture)**
```javascript
type: 'pink'
volume: -20dB
trigger: Mouse down/drag
```

**Audio Mapping Logic:**
```
X Position (0-60)  →  MIDI Note (48-84)  →  C3 to C6
Y Position (0-35)  →  Duration (0.1-0.5s)
Pattern Type       →  Chord (C, Dm, Em, F major)
```

### 3. Interaction System

**Event Handlers:**

| Event | Visual Response | Audio Response |
|-------|----------------|----------------|
| Click | Change pattern | Play chord + trigger note at click position |
| Mouse Down | Enable mouse influence on pattern | Start noise generator |
| Mouse Drag | Ripple effect following cursor | Play continuous notes |
| Mouse Up | Disable mouse influence | Stop noise generator |

**Mouse Influence Formula:**
```javascript
influence = exp(-distance * 0.1) * sin(time * 2)
```
Creates circular ripples that decay with distance from cursor.

---

## State Management

### React State Variables

```javascript
frame            // Animation frame counter (0-2880)
patternType      // Current pattern index (0-3)
mousePos         // { x, y } in screen coordinates
mouseDown        // Boolean: is mouse currently pressed
audioStarted     // Boolean: has audio context been initialized
```

### Refs (Non-Rendering State)

```javascript
synthRef         // Tone.js PolySynth instance
noiseRef         // Tone.js Noise instance
containerRef     // DOM reference for coordinate mapping
lastNoteTime     // Throttle rapid note triggering
```

---

## Performance Considerations

### Optimization Strategies

1. **Note Throttling**: Minimum 50ms between notes prevents audio clipping
2. **Frame Rate**: Animation runs at 60fps, pattern updates at ~1/12 speed
3. **ASCII Pre-calculation**: Characters mapped to values, not recalculated
4. **Event Debouncing**: Mouse move events processed every frame, not every pixel

### Resource Management

**Memory:**
- Pattern state: ~4KB
- Audio buffers: ~100KB (managed by Tone.js)
- DOM: Single pre element, minimal memory

**CPU:**
- Pattern calculation: O(width × height) per frame = O(2100) operations
- Audio synthesis: Handled by Web Audio API (hardware accelerated)

---

## Audio Technical Specifications

### Frequency Range
- **Lowest Note**: C3 (130.81 Hz)
- **Highest Note**: C6 (1046.50 Hz)
- **Total Range**: 3 octaves, chromatic

### Timing
- **Note Attack**: 20ms
- **Note Duration**: 100-500ms (Y-position dependent)
- **Chord Duration**: 500ms
- **Noise Fade Out**: 200ms

### Polyphony
- **Max Simultaneous Notes**: 32 (PolySynth default)
- **Typical Usage**: 1-5 notes at once

---

## Development Guidelines

### Code Style
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: Explain "why", not "what"
- **Functions**: Single responsibility, max 50 lines
- **State**: Keep minimal, derive what you can

### Git Workflow
```bash
main              # Production-ready code
├── develop       # Integration branch
├── feature/*     # New features
├── bugfix/*      # Bug fixes
└── hotfix/*      # Emergency fixes
```

### Commit Messages
```
feat: Add MIDI controller support
fix: Prevent audio clipping on rapid clicks
docs: Update README with deployment instructions
refactor: Extract pattern logic to separate module
```

### Testing Strategy
- **Manual Testing**: Test all interactions in different browsers
- **Performance**: Monitor frame rate, audio latency
- **Accessibility**: Keyboard navigation, screen reader support
- **Mobile**: Test touch interactions, portrait/landscape

---

## Configuration

### Adjustable Parameters

**Visual:**
```javascript
width = 60              // Pattern grid width
height = 35             // Pattern grid height
slowdownFactor = 12     // Animation speed (higher = slower)
fontSize = '12px'       // ASCII character size
backgroundColor = '#F0EEE6'
```

**Audio:**
```javascript
noteRange = [48, 84]         // MIDI note range (C3-C6)
minNoteDuration = 0.1        // Seconds
maxNoteDuration = 0.5        // Seconds
noteThrottle = 0.05          // Seconds between notes
noiseVolume = -20            // dB
```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

### Environment Variables
```bash
# .env (if needed in future)
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENABLE_ANALYTICS=true
```

---

## Support & Contributing

### Getting Help
- GitHub Issues: Report bugs, request features
- Discussions: Ask questions, share ideas
- Wiki: Community guides and tutorials

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

### Code Review Checklist
- [ ] Code follows style guide
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested in multiple browsers

---

## Credits & License

**Created by:** vyakart  
**License:** GNU General Public License v3.0 (GPL-3.0)  
**Dependencies:**
- React (MIT)
- Tone.js (MIT)

**Inspiration:**
- Conway's Game of Life (John Horton Conway)
- ASCII art tradition
- Generative audio systems
- Interactive installations

---

*This document should evolve with the project. Keep it updated as you add features and learn more about your system.*