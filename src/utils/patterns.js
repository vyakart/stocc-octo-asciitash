/**
 * Mathematical pattern generators
 * Each function returns a value between -1 and 1
 * Used to map to ASCII characters
 */

export const patterns = {
  /**
   * Balance: Radial waves emanating from center point
   */
  balance: (x, y, t, width, height, mousePos = null) => {
    const centerX = width / 2;
    const centerY = height / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let value = Math.sin(distance * 0.5 - t * 0.05) * Math.cos(t * 0.03);

    // Add mouse influence if present
    if (mousePos) {
      const mouseDist = Math.sqrt(
        Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
      );
      const influence = Math.exp(-mouseDist * 0.1) * Math.sin(t * 2);
      value += influence * 0.5;
    }

    return Math.max(-1, Math.min(1, value));
  },

  /**
   * Duality: Split-screen opposing forces
   */
  duality: (x, y, t, width, height, mousePos = null) => {
    const leftSide = Math.sin(x * 0.3 + t * 0.05) * Math.cos(y * 0.2);
    const rightSide = Math.cos(x * 0.3 - t * 0.05) * Math.sin(y * 0.2);

    const blend = x / width;
    let value = leftSide * (1 - blend) + rightSide * blend;

    if (mousePos) {
      const mouseDist = Math.sqrt(
        Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
      );
      const influence = Math.exp(-mouseDist * 0.1) * Math.sin(t * 2);
      value += influence * 0.5;
    }

    return Math.max(-1, Math.min(1, value));
  },

  /**
   * Flow: Circular/spiral motion patterns
   */
  flow: (x, y, t, width, height, mousePos = null) => {
    const centerX = width / 2;
    const centerY = height / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);

    let value = Math.sin(angle * 3 + distance * 0.2 - t * 0.08) *
                Math.cos(distance * 0.1 + t * 0.05);

    if (mousePos) {
      const mouseDist = Math.sqrt(
        Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
      );
      const influence = Math.exp(-mouseDist * 0.1) * Math.sin(t * 2);
      value += influence * 0.5;
    }

    return Math.max(-1, Math.min(1, value));
  },

  /**
   * Chaos: Organic, pseudo-random movement
   */
  chaos: (x, y, t, width, height, mousePos = null) => {
    const noise1 = Math.sin(x * 0.1 + t * 0.03) * Math.cos(y * 0.15 + t * 0.04);
    const noise2 = Math.sin(x * 0.08 - t * 0.02) * Math.sin(y * 0.12 - t * 0.05);
    const noise3 = Math.cos(x * 0.12 + y * 0.1 + t * 0.06);

    let value = (noise1 + noise2 + noise3) / 3;

    if (mousePos) {
      const mouseDist = Math.sqrt(
        Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
      );
      const influence = Math.exp(-mouseDist * 0.1) * Math.sin(t * 2);
      value += influence * 0.5;
    }

    return Math.max(-1, Math.min(1, value));
  }
};

/**
 * Map a float value (-1 to 1) to ASCII character
 */
export const valueToASCII = (value) => {
  if (value > 0.8) return '█';
  if (value > 0.5) return '▓';
  if (value > 0.2) return '▒';
  if (value > -0.2) return '░';
  if (value > -0.5) return '·';
  return ' ';
};

export const PATTERN_NAMES = ['Balance', 'Duality', 'Flow', 'Chaos'];
