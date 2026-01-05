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
  ]
};

/**
 * Rotate a pattern 90 degrees clockwise
 */
const rotatePattern90 = (pattern) => {
  const rows = pattern.length;
  const cols = pattern[0].length;
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[x][rows - 1 - y] = pattern[y][x];
    }
  }

  return rotated;
};

/**
 * Flip a pattern horizontally
 */
const flipPatternHorizontal = (pattern) => {
  return pattern.map(row => [...row].reverse());
};

/**
 * Flip a pattern vertically
 */
const flipPatternVertical = (pattern) => {
  return [...pattern].reverse();
};

/**
 * Get a pattern with random orientation
 * Applies random rotation (0°, 90°, 180°, 270°) and optional flip
 */
const getOrientedPattern = (pattern) => {
  let oriented = pattern;

  // Random rotation: 0, 90, 180, or 270 degrees
  const rotations = Math.floor(Math.random() * 4);
  for (let i = 0; i < rotations; i++) {
    oriented = rotatePattern90(oriented);
  }

  // Random flip (50% chance for horizontal, 50% for vertical)
  if (Math.random() < 0.3) {
    oriented = flipPatternHorizontal(oriented);
  } else if (Math.random() < 0.3) {
    oriented = flipPatternVertical(oriented);
  }

  return oriented;
};

/**
 * Place a glider pattern on the grid at given position with random orientation
 */
const placeGlider = (grid, x, y, gliderType = 'standard') => {
  const basePattern = GLIDERS[gliderType];
  const pattern = getOrientedPattern(basePattern);
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
 * Spawns 3-5 gliders at random positions with random orientations
 * Adds 10-15% random noise for emergent patterns
 */
export const initializeConwayGrid = (width, height) => {
  const grid = createEmptyGrid(width, height);

  // Spawn 3-5 gliders at random positions with random orientations
  const numGliders = 3 + Math.floor(Math.random() * 3);
  const gliderTypes = Object.keys(GLIDERS);

  for (let i = 0; i < numGliders; i++) {
    const x = Math.floor(Math.random() * (width - 10));
    const y = Math.floor(Math.random() * (height - 10));
    const type = gliderTypes[Math.floor(Math.random() * gliderTypes.length)];
    placeGlider(grid, x, y, type); // Applies random rotation & flip
  }

  // Add random noise (10-15% density) for emergent patterns
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
 * Detect collision events by finding clusters of births
 * A collision is detected when multiple births occur in close proximity
 */
const detectCollisions = (birthPositions, minClusterSize = 3, maxDistance = 5) => {
  if (birthPositions.length < minClusterSize) return [];

  const collisions = [];
  const visited = new Set();

  for (let i = 0; i < birthPositions.length; i++) {
    if (visited.has(i)) continue;

    const cluster = [birthPositions[i]];
    visited.add(i);

    // Find nearby births
    for (let j = i + 1; j < birthPositions.length; j++) {
      if (visited.has(j)) continue;

      const dx = birthPositions[i].x - birthPositions[j].x;
      const dy = birthPositions[i].y - birthPositions[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= maxDistance) {
        cluster.push(birthPositions[j]);
        visited.add(j);
      }
    }

    // If cluster is large enough, it's a collision
    if (cluster.length >= minClusterSize) {
      // Calculate center of collision
      const centerX = cluster.reduce((sum, pos) => sum + pos.x, 0) / cluster.length;
      const centerY = cluster.reduce((sum, pos) => sum + pos.y, 0) / cluster.length;
      collisions.push({
        x: Math.round(centerX),
        y: Math.round(centerY),
        intensity: cluster.length
      });
    }
  }

  return collisions;
};

/**
 * Update grid according to Conway's Game of Life rules
 * Returns: { nextGrid, birthPositions, collisions }
 * birthPositions is used for audio triggering
 * collisions represents glider/pattern interactions
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

  // Detect collisions from birth patterns
  const collisions = detectCollisions(birthPositions);

  return { nextGrid, birthPositions, collisions };
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
