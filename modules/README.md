# ASCII Patterns - nw_wrld Module

An nw_wrld-compatible audio visual module that transforms mathematical patterns into ASCII art. Perfect for live performances, VJ sets, and generative visual compositions.

## Features

- **4 Unique Patterns**: Balance (radial waves), Duality (split forces), Flow (spirals), Chaos (organic movement)
- **Real-time Parameters**: Speed, density, and mouse interaction controls
- **Interactive**: Mouse movement influences pattern generation
- **Performable**: Designed for sequencer control with mutually exclusive pattern switching

## Installation

1. Copy `ASCIIPatterns.js` to your nw_wrld workspace's `modules/` folder:
   ```
   your-nw_wrld-workspace/
   └── modules/
       └── ASCIIPatterns.js
   ```

2. nw_wrld will auto-detect and load the module with hot reload support

## Module Structure

**Category:** Audio Visual
**Extends:** ModuleBase
**Imports:** ModuleBase only (fully self-contained)

## Methods

### Pattern Triggers (Mutually Exclusive)

Switch between visual scenes - only one pattern active at a time (music producer approach).

#### `triggerBalance()`
- **Type:** Trigger
- **Execute on Load:** Yes (default pattern)
- **Description:** Activates radial wave pattern emanating from center
- **Visual:** Concentric circles with sine wave modulation
- **Best for:** Opening scenes, calm sections, meditation

#### `triggerDuality()`
- **Type:** Trigger
- **Execute on Load:** No
- **Description:** Activates split-screen opposing forces
- **Visual:** Left/right contrasting patterns with smooth blend
- **Best for:** Tension, conflict, dramatic transitions

#### `triggerFlow()`
- **Type:** Trigger
- **Execute on Load:** No
- **Description:** Activates circular/spiral motion patterns
- **Visual:** Rotating spirals with angular momentum
- **Best for:** Movement, energy, dance sections

#### `triggerChaos()`
- **Type:** Trigger
- **Execute on Load:** No
- **Description:** Activates organic, pseudo-random movement
- **Visual:** Multiple sine wave layers creating organic textures
- **Best for:** Breakdowns, noise sections, experimental moments

### Parameter Controls (Continuous)

Modulate these in real-time during performance.

#### `setSpeed({ value })`
- **Type:** Range (0.1 - 2.0)
- **Default:** 1.0
- **Description:** Controls animation speed
- **Musical Mapping:**
  - 0.1-0.5: Slow, ambient
  - 1.0: Normal tempo
  - 1.5-2.0: Fast, energetic
- **Tip:** Automate speed changes for build-ups and drops

#### `setDensity({ value })`
- **Type:** Range (0.5 - 2.0)
- **Default:** 1.0
- **Description:** Controls pattern intensity/contrast
- **Musical Mapping:**
  - 0.5-0.8: Sparse, minimal
  - 1.0: Balanced
  - 1.5-2.0: Dense, maximal
- **Tip:** Map to song energy/loudness for dynamic visuals

#### `setMouseInfluence({ value })`
- **Type:** Range (0.0 - 1.0)
- **Default:** 0.5
- **Description:** Controls mouse interaction strength
- **Musical Mapping:**
  - 0.0: No mouse influence
  - 0.5: Moderate interaction
  - 1.0: Maximum interaction
- **Tip:** Enable during interactive sections, disable for fixed visuals

### Playback Controls

#### `pause({ paused })`
- **Type:** Toggle
- **Default:** false
- **Description:** Pause/resume animation
- **Use Case:** Freeze frame effects, manual control

#### `clear()`
- **Type:** Trigger
- **Description:** Resets frame counter and clears screen
- **Use Case:** Hard cuts, resets between songs

## Sequencer Mapping Examples

### Example 1: Basic Pattern Sequence
```
Bar 1-4:   triggerBalance()
Bar 5-8:   triggerDuality()
Bar 9-12:  triggerFlow()
Bar 13-16: triggerChaos()
```

### Example 2: Speed Automation
```
Beat 1:  setSpeed(0.5)   // Start slow
Beat 8:  setSpeed(1.0)   // Normal
Beat 16: setSpeed(2.0)   // Build up
Beat 17: setSpeed(1.0)   // Drop back
```

### Example 3: Density Build-Up
```
Bar 1:  setDensity(0.5) + triggerBalance()   // Sparse intro
Bar 2:  setDensity(0.7)                      // Build
Bar 3:  setDensity(1.2)                      // More energy
Bar 4:  setDensity(1.8)                      // Peak
Bar 5:  setDensity(1.0) + triggerFlow()      // Drop + pattern change
```

### Example 4: Interactive Performance
```
Verse:   triggerBalance(), setMouseInfluence(0.0)  // Fixed visuals
Chorus:  triggerFlow(), setMouseInfluence(1.0)     // Allow interaction
Bridge:  triggerChaos(), setMouseInfluence(0.5)    // Moderate interaction
```

## MIDI/OSC Mapping Suggestions

### Recommended MIDI CC Mappings
- **CC 1 (Mod Wheel):** → `setDensity()`
- **CC 2 (Breath):** → `setSpeed()`
- **CC 74 (Filter Cutoff):** → `setMouseInfluence()`

### Pattern Trigger Notes
- **C3 (60):** → `triggerBalance()`
- **D3 (62):** → `triggerDuality()`
- **E3 (64):** → `triggerFlow()`
- **F3 (65):** → `triggerChaos()`

## Performance Tips

### 1. Pattern Switching Strategy
- Switch patterns on musical phrases (every 4/8/16 bars)
- Use pattern changes to emphasize song structure
- Create call-and-response with pattern + parameter changes

### 2. Parameter Automation
- Automate density to follow track loudness/energy
- Use speed changes for build-ups and breakdowns
- Combine mouse influence with live performance sections

### 3. Visual Composition
- Balance: Best for openings and ambient sections
- Duality: Creates tension, use before drops
- Flow: High energy, dance floor moments
- Chaos: Experimental, textural sections

### 4. Mouse Interaction
- Move mouse during live performance for organic variations
- Set influence to 0.0 for fixed, repeatable visuals
- Use high influence (0.8-1.0) for improvisational sections

## Technical Details

### Grid Configuration
- **Size:** 60 × 35 characters
- **ASCII Characters:** `█ ▓ ▒ ░ · (space)`
- **Update Rate:** 60 FPS (requestAnimationFrame)
- **Frame Loop:** 2880 frames (48 seconds at 60fps)

### Pattern Algorithms
All patterns use mathematical functions (sin, cos, atan2) with time-based evolution:
- **Balance:** Radial distance + time modulation
- **Duality:** X-axis blending of opposing functions
- **Flow:** Polar coordinates (angle + distance)
- **Chaos:** Multi-frequency sine/cosine layering

### Mouse Tracking
- Exponential distance decay: `exp(-distance * 0.1)`
- Time-based modulation: `sin(t * 2)`
- Scales with `mouseInfluence` parameter

### Performance Optimization
- Efficient ASCII character lookup (6 ranges)
- Minimal DOM manipulation (single pre element update)
- Math-heavy but CPU-friendly (no WebGL overhead)
- Automatic cleanup in destroy()

## Styling

The module uses monospace ASCII with matrix-style green glow:
- **Font:** Monospace, 12px
- **Color:** `#00ff41` (matrix green)
- **Text Shadow:** `0 0 5px #00ff41`
- **Background:** `#0a0a0a` (near black)

You can modify these styles in the `init()` method for different aesthetics.

## Integration with Audio

While nw_wrld handles audio routing separately, this module is designed to respond musically:

1. **Pattern changes** = Scene changes (like video clips in a VJ set)
2. **Speed parameter** = BPM/tempo alignment
3. **Density parameter** = Loudness/energy response
4. **Mouse influence** = Performance expressiveness

Use nw_wrld's sequencer to trigger pattern changes and parameter modulations in sync with your audio composition.

## Troubleshooting

### Module Not Loading
- Ensure file is named `ASCIIPatterns.js` (case-sensitive)
- Check docblock has proper `@nwWrld` tags
- Verify it's in your workspace's `modules/` folder

### Pattern Not Changing
- Patterns are mutually exclusive - only one active at a time
- Check that trigger method is being called by sequencer
- Verify method name matches exactly (case-sensitive)

### Performance Issues
- Module is CPU-based (no GPU required)
- Should run at 60fps on modern hardware
- If lagging, check for other CPU-intensive modules running

## License

GNU General Public License v3.0 (GPL-3.0)
Part of the ASCII Audio Visualizer project

## Credits

**Original Project:** ASCII Audio Visualizer
**Module Adaptation:** nw_wrld compatible version
**Pattern Algorithms:** Mathematical sine/cosine generators
**Inspired By:** ASCII art, generative systems, VJ culture

---

**Happy Performing! 🎵🎨**

*For more info on nw_wrld module development, see: https://github.com/aagentah/nw_wrld/blob/main/MODULE_DEVELOPMENT.md*
