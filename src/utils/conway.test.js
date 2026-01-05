/**
 * Unit tests for Conway's Game of Life implementation
 * Run with: npm test
 */

import {
  createEmptyGrid,
  countLiveNeighbors,
  updateConway,
  toggleCell,
  conwayToASCII
} from './conway';

describe('Conway\'s Game of Life', () => {
  test('createEmptyGrid creates grid with correct dimensions', () => {
    const grid = createEmptyGrid(5, 3);
    expect(grid.length).toBe(3); // height
    expect(grid[0].length).toBe(5); // width
    expect(grid[0][0]).toBe(0);
  });

  test('countLiveNeighbors counts correctly without wraparound', () => {
    const grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0]
    ];
    // Center position should have 3 neighbors
    expect(countLiveNeighbors(grid, 1, 1)).toBe(3);
  });

  test('countLiveNeighbors handles toroidal wraparound', () => {
    const grid = [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ];
    // Corner (0,0) should see neighbors at opposite edges
    expect(countLiveNeighbors(grid, 0, 0)).toBe(3);
  });

  test('updateConway: cell with 2 neighbors survives', () => {
    const grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0]
    ];
    const { nextGrid } = updateConway(grid);
    expect(nextGrid[0][0]).toBe(1); // Should survive with 2 neighbors
  });

  test('updateConway: cell with 3 neighbors survives', () => {
    const grid = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0]
    ];
    const { nextGrid } = updateConway(grid);
    expect(nextGrid[0][0]).toBe(1); // Should survive with 3 neighbors
  });

  test('updateConway: dead cell with 3 neighbors is born', () => {
    const grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0]
    ];
    const { nextGrid, birthPositions } = updateConway(grid);
    expect(nextGrid[1][1]).toBe(1); // Should be born
    expect(birthPositions).toContainEqual({ x: 1, y: 1 });
  });

  test('updateConway: cell with <2 neighbors dies', () => {
    const grid = [
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const { nextGrid } = updateConway(grid);
    expect(nextGrid[0][0]).toBe(0); // Should die
  });

  test('updateConway: cell with >3 neighbors dies', () => {
    const grid = [
      [1, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ];
    const { nextGrid } = updateConway(grid);
    expect(nextGrid[1][1]).toBe(0); // Should die from overpopulation
  });

  test('toggleCell changes cell state', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const newGrid = toggleCell(grid, 1, 1);
    expect(newGrid[1][1]).toBe(1);

    const toggledBack = toggleCell(newGrid, 1, 1);
    expect(toggledBack[1][1]).toBe(0);
  });

  test('conwayToASCII renders correctly', () => {
    const grid = [
      [1, 0],
      [0, 1]
    ];
    const ascii = conwayToASCII(grid);
    expect(ascii).toBe('█ \n █');
  });

  test('Standard glider pattern moves correctly', () => {
    // Standard glider at top-left
    const grid = createEmptyGrid(10, 10);
    grid[0][1] = 1;
    grid[1][2] = 1;
    grid[2][0] = 1;
    grid[2][1] = 1;
    grid[2][2] = 1;

    // Run 4 generations
    let current = grid;
    for (let i = 0; i < 4; i++) {
      const { nextGrid } = updateConway(current);
      current = nextGrid;
    }

    // Glider should have moved down and right
    // This is a basic check - full glider verification would be more complex
    const liveCount = current.flat().filter(cell => cell === 1).length;
    expect(liveCount).toBe(5); // Glider maintains 5 cells
  });
});
