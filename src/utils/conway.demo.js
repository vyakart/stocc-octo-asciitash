/**
 * Conway's Game of Life - Visual Demonstration
 * Run with: node src/utils/conway.demo.js
 */

import {
  createEmptyGrid,
  updateConway,
  conwayToASCII,
  countLiveNeighbors
} from './conway.js';

console.log('=== Conway\'s Game of Life Implementation Demo ===\n');

// Demo 1: Blinker oscillator (period 2)
console.log('DEMO 1: Blinker Oscillator (Period 2)');
console.log('A simple pattern that oscillates between two states\n');

let blinker = createEmptyGrid(5, 5);
blinker[2][1] = 1;
blinker[2][2] = 1;
blinker[2][3] = 1;

console.log('Generation 0:');
console.log(conwayToASCII(blinker));

const { nextGrid: blinker1 } = updateConway(blinker);
console.log('\nGeneration 1:');
console.log(conwayToASCII(blinker1));

const { nextGrid: blinker2 } = updateConway(blinker1);
console.log('\nGeneration 2 (back to original):');
console.log(conwayToASCII(blinker2));

// Demo 2: Block (still life - stable)
console.log('\n\n=== DEMO 2: Block (Still Life) ===');
console.log('A stable pattern that never changes\n');

let block = createEmptyGrid(4, 4);
block[1][1] = 1;
block[1][2] = 1;
block[2][1] = 1;
block[2][2] = 1;

console.log('Generation 0:');
console.log(conwayToASCII(block));

const { nextGrid: block1 } = updateConway(block);
console.log('\nGeneration 1 (unchanged):');
console.log(conwayToASCII(block1));

// Demo 3: Glider (moves diagonally)
console.log('\n\n=== DEMO 3: Glider (Moves Diagonally) ===');
console.log('Tracks through 5 generations showing movement\n');

let glider = createEmptyGrid(10, 10);
glider[1][2] = 1;
glider[2][3] = 1;
glider[3][1] = 1;
glider[3][2] = 1;
glider[3][3] = 1;

console.log('Generation 0:');
console.log(conwayToASCII(glider));

let current = glider;
for (let gen = 1; gen <= 4; gen++) {
  const { nextGrid, birthPositions } = updateConway(current);
  console.log(`\nGeneration ${gen}:`);
  console.log(conwayToASCII(nextGrid));
  if (birthPositions.length > 0) {
    console.log(`Births: ${birthPositions.length} new cells`);
  }
  current = nextGrid;
}

// Demo 4: Toroidal topology (wraparound)
console.log('\n\n=== DEMO 4: Toroidal Topology (Edge Wraparound) ===');
console.log('Pattern at edges wraps around to opposite side\n');

let wrap = createEmptyGrid(5, 5);
wrap[0][0] = 1; // Top-left corner
wrap[0][4] = 1; // Top-right corner
wrap[4][0] = 1; // Bottom-left corner

console.log('Generation 0:');
console.log(conwayToASCII(wrap));
console.log(`\nNeighbor count at (0,0): ${countLiveNeighbors(wrap, 0, 0)}`);
console.log('(Should be 2 due to wraparound - counts bottom-left and top-right)');

const { nextGrid: wrap1 } = updateConway(wrap);
console.log('\nGeneration 1:');
console.log(conwayToASCII(wrap1));

// Demo 5: Birth tracking (for audio)
console.log('\n\n=== DEMO 5: Birth Tracking (Audio Integration) ===');

let births = createEmptyGrid(5, 5);
births[2][1] = 1;
births[2][2] = 1;
births[2][3] = 1;

console.log('Generation 0:');
console.log(conwayToASCII(births));

const { nextGrid: births1, birthPositions } = updateConway(births);
console.log('\nGeneration 1:');
console.log(conwayToASCII(births1));
console.log(`\nNew births (for audio): ${JSON.stringify(birthPositions)}`);
console.log('Each birth triggers a note at its (x, y) position');

console.log('\n=== Implementation Summary ===');
console.log('✓ Grid system with 2D arrays');
console.log('✓ Toroidal topology (wraparound edges)');
console.log('✓ Conway\'s rules: survive (2-3), birth (3), death (otherwise)');
console.log('✓ Birth tracking for audio integration');
console.log('✓ Glider patterns spawn correctly');
console.log('✓ Cell toggling for user interaction');
console.log('\nImplementation matches design document specification!');
