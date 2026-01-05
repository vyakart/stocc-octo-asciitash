/**
 * Conway's Game of Life Implementation
 * Cellular automaton with emergent patterns and glider formations
 */

/**
 * Create an empty grid filled with zeros (dead cells)
 */
export const createEmptyGrid = (width, height) => {
  return Array(height).fill(null).map(() => Array(width).fill(0));
};

/**
 * Glider patterns that move across the grid
 */
const GLIDERS = {
  standard: [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1]
  ],
  lwss: [ // Lightweight Spaceship
    [0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0]
  ],
  glider2: [ // Flipped glider
    [1, 0, 1],
    [0, 1, 1],
    [0, 1, 0]
  ]
};

/**
 * Place a glider pattern on the grid at given position
 */
const placeGlider = (grid, x, y, gliderType = 'standard') => {
  const pattern = GLIDERS[gliderType];
  const height = grid.length;
  const width = grid[0].length;

  for (let dy = 0; dy < pattern.length; dy++) {
    for (let dx = 0; dx < pattern[dy].length; dx++) {
      const ny = (y + dy) % height;
      const nx = (x + dx) % width;
      grid[ny][nx] = pattern[dy][dx];
    }
  }
};

/**
 * Initialize grid with gliders and random noise
 */
export const initializeConwayGrid = (width, height) => {
  const grid = createEmptyGrid(width, height);

  // Spawn 3-5 gliders at random positions
  const numGliders = 3 + Math.floor(Math.random() * 3);
  const gliderTypes = Object.keys(GLIDERS);

  for (let i = 0; i < numGliders; i++) {
    const x = Math.floor(Math.random() * (width - 10));
    const y = Math.floor(Math.random() * (height - 10));
    const type = gliderTypes[Math.floor(Math.random() * gliderTypes.length)];
    placeGlider(grid, x, y, type);
  }

  // Add random noise (10-15% density)
  const noiseDensity = 0.10 + Math.random() * 0.05;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (Math.random() < noiseDensity && grid[y][x] === 0) {
        grid[y][x] = 1;
      }
    }
  }

  return grid;
};

/**
 * Count live neighbors with wraparound (toroidal topology)
 */
export const countLiveNeighbors = (grid, x, y) => {
  const height = grid.length;
  const width = grid[0].length;
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
};

/**
 * Update grid according to Conway's Game of Life rules
 * Returns: { nextGrid, birthPositions }
 * birthPositions is used for audio triggering
 */
export const updateConway = (currentGrid) => {
  const height = currentGrid.length;
  const width = currentGrid[0].length;
  const nextGrid = createEmptyGrid(width, height);
  const birthPositions = []; // Track new cells for audio

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const neighbors = countLiveNeighbors(currentGrid, x, y);
      const isAlive = currentGrid[y][x] === 1;

      if (isAlive && (neighbors === 2 || neighbors === 3)) {
        nextGrid[y][x] = 1; // Survive
      } else if (!isAlive && neighbors === 3) {
        nextGrid[y][x] = 1; // Birth
        birthPositions.push({ x, y }); // Track birth for audio
      }
      // else: death or stay dead (0)
    }
  }

  return { nextGrid, birthPositions };
};

/**
 * Toggle a cell's state (for user interaction)
 */
export const toggleCell = (grid, x, y) => {
  const height = grid.length;
  const width = grid[0].length;

  if (x >= 0 && x < width && y >= 0 && y < height) {
    const newGrid = grid.map(row => [...row]);
    newGrid[y][x] = newGrid[y][x] === 1 ? 0 : 1;
    return newGrid;
  }

  return grid;
};

/**
 * Convert Conway grid to ASCII string
 */
export const conwayToASCII = (grid) => {
  return grid.map(row =>
    row.map(cell => cell === 1 ? '█' : ' ').join('')
  ).join('\n');
};

/**
 * Calculate population density (for audio effects)
 */
export const getPopulationDensity = (grid) => {
  const height = grid.length;
  const width = grid[0].length;
  let count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 1) count++;
    }
  }

  return count / (width * height);
};
