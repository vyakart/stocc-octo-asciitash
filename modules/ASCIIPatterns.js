/*
@nwWrld name: ASCII Patterns
@nwWrld category: Audio Visual
@nwWrld imports: ModuleBase
*/

class ASCIIPatterns extends ModuleBase {
  static methods = [
    // Pattern triggers (mutually exclusive - switch between visual scenes)
    {
      name: "triggerBalance",
      executeOnLoad: true,
      options: []
    },
    {
      name: "triggerDuality",
      executeOnLoad: false,
      options: []
    },
    {
      name: "triggerFlow",
      executeOnLoad: false,
      options: []
    },
    {
      name: "triggerChaos",
      executeOnLoad: false,
      options: []
    },

    // Parameter controls (continuous modulation)
    {
      name: "setSpeed",
      executeOnLoad: false,
      options: [
        { name: "value", defaultVal: 1.0, type: "range" }
      ]
    },
    {
      name: "setDensity",
      executeOnLoad: false,
      options: [
        { name: "value", defaultVal: 1.0, type: "range" }
      ]
    },
    {
      name: "setMouseInfluence",
      executeOnLoad: false,
      options: [
        { name: "value", defaultVal: 0.5, type: "range" }
      ]
    },

    // Playback controls
    {
      name: "pause",
      executeOnLoad: false,
      options: [
        { name: "paused", defaultVal: false, type: "toggle" }
      ]
    },
    {
      name: "clear",
      executeOnLoad: false,
      options: []
    }
  ];

  constructor(container) {
    super(container);

    // Configuration
    this.config = {
      width: 60,
      height: 35,
      slowdownFactor: 12
    };

    // State
    this.frame = 0;
    this.currentPattern = 'balance';
    this.mousePos = null;
    this.isPaused = false;
    this.speed = 1.0;
    this.density = 1.0;
    this.mouseInfluence = 0.5;

    // DOM elements
    this.canvas = null;
    this.pre = null;

    // Animation
    this.animationFrameId = null;

    // Initialize
    this.init();
  }

  init() {
    // Create container div
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.background = '#0a0a0a';
    wrapper.style.overflow = 'hidden';

    // Create pre element for ASCII art
    this.pre = document.createElement('pre');
    this.pre.style.margin = '0';
    this.pre.style.padding = '20px';
    this.pre.style.fontFamily = 'monospace';
    this.pre.style.fontSize = '12px';
    this.pre.style.lineHeight = '1';
    this.pre.style.color = '#00ff41';
    this.pre.style.textShadow = '0 0 5px #00ff41';
    this.pre.style.whiteSpace = 'pre';
    this.pre.style.userSelect = 'none';
    this.pre.style.cursor = 'crosshair';

    wrapper.appendChild(this.pre);
    this.elem.appendChild(wrapper);

    // Mouse tracking
    this.pre.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.pre.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    // Start animation
    this.startAnimation();
  }

  handleMouseMove(e) {
    const rect = this.pre.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const charWidth = rect.width / this.config.width;
    const charHeight = rect.height / this.config.height;

    const gridX = Math.floor(x / charWidth);
    const gridY = Math.floor(y / charHeight);

    this.mousePos = {
      x: Math.max(0, Math.min(this.config.width - 1, gridX)),
      y: Math.max(0, Math.min(this.config.height - 1, gridY))
    };
  }

  handleMouseLeave() {
    this.mousePos = null;
  }

  // Pattern algorithms (from your patterns.js)
  patterns = {
    balance: (x, y, t, width, height, mousePos) => {
      const centerX = width / 2;
      const centerY = height / 2;

      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let value = Math.sin(distance * 0.5 - t * 0.05) * Math.cos(t * 0.03);

      if (mousePos) {
        const mouseDist = Math.sqrt(
          Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
        );
        const influence = Math.exp(-mouseDist * 0.1) * Math.sin(t * 2);
        value += influence * 0.5 * this.mouseInfluence;
      }

      return Math.max(-1, Math.min(1, value * this.density));
    },

    duality: (x, y, t, width, height, mousePos) => {
      const leftSide = Math.sin(x * 0.3 + t * 0.05) * Math.cos(y * 0.2);
      const rightSide = Math.cos(x * 0.3 - t * 0.05) * Math.sin(y * 0.2);

      const blend = x / width;
      let value = leftSide * (1 - blend) + rightSide * blend;

      if (mousePos) {
        const mouseDist = Math.sqrt(
          Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
        );
        const influence = Math.exp(-mouseDist * 0.1) * Math.sin(t * 2);
        value += influence * 0.5 * this.mouseInfluence;
      }

      return Math.max(-1, Math.min(1, value * this.density));
    },

    flow: (x, y, t, width, height, mousePos) => {
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
        value += influence * 0.5 * this.mouseInfluence;
      }

      return Math.max(-1, Math.min(1, value * this.density));
    },

    chaos: (x, y, t, width, height, mousePos) => {
      const noise1 = Math.sin(x * 0.1 + t * 0.03) * Math.cos(y * 0.15 + t * 0.04);
      const noise2 = Math.sin(x * 0.08 - t * 0.02) * Math.sin(y * 0.12 - t * 0.05);
      const noise3 = Math.cos(x * 0.12 + y * 0.1 + t * 0.06);

      let value = (noise1 + noise2 + noise3) / 3;

      if (mousePos) {
        const mouseDist = Math.sqrt(
          Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
        );
        const influence = Math.exp(-mouseDist * 0.1) * Math.sin(t * 2);
        value += influence * 0.5 * this.mouseInfluence;
      }

      return Math.max(-1, Math.min(1, value * this.density));
    }
  };

  // ASCII mapping
  valueToASCII(value) {
    if (value > 0.8) return '█';
    if (value > 0.5) return '▓';
    if (value > 0.2) return '▒';
    if (value > -0.2) return '░';
    if (value > -0.5) return '·';
    return ' ';
  }

  // Render current pattern
  renderPattern() {
    const patternFunc = this.patterns[this.currentPattern];
    if (!patternFunc) return '';

    let output = '';
    const t = this.frame / (this.config.slowdownFactor / this.speed);

    for (let y = 0; y < this.config.height; y++) {
      for (let x = 0; x < this.config.width; x++) {
        const value = patternFunc.call(
          this,
          x,
          y,
          t,
          this.config.width,
          this.config.height,
          this.mousePos
        );
        output += this.valueToASCII(value);
      }
      output += '\n';
    }

    return output;
  }

  // Animation loop
  animate() {
    if (!this.isPaused) {
      this.frame = (this.frame + 1) % 2880;
      const pattern = this.renderPattern();
      if (this.pre) {
        this.pre.textContent = pattern;
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  startAnimation() {
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Public methods for nw_wrld sequencer

  triggerBalance() {
    this.currentPattern = 'balance';
  }

  triggerDuality() {
    this.currentPattern = 'duality';
  }

  triggerFlow() {
    this.currentPattern = 'flow';
  }

  triggerChaos() {
    this.currentPattern = 'chaos';
  }

  setSpeed({ value = 1.0 }) {
    this.speed = Math.max(0.1, Math.min(2.0, value));
  }

  setDensity({ value = 1.0 }) {
    this.density = Math.max(0.5, Math.min(2.0, value));
  }

  setMouseInfluence({ value = 0.5 }) {
    this.mouseInfluence = Math.max(0.0, Math.min(1.0, value));
  }

  pause({ paused = false }) {
    this.isPaused = paused;
  }

  clear() {
    this.frame = 0;
    this.mousePos = null;
    if (this.pre) {
      this.pre.textContent = '';
    }
  }

  // Cleanup
  destroy() {
    this.stopAnimation();

    if (this.pre) {
      this.pre.removeEventListener('mousemove', this.handleMouseMove);
      this.pre.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    super.destroy();
  }
}

export default ASCIIPatterns;
