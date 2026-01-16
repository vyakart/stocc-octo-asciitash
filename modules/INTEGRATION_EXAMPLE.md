# ASCII Patterns - nw_wrld Integration Example

Quick guide to get your ASCII Patterns module running in nw_wrld.

## Step 1: Copy Module to nw_wrld Workspace

```bash
# From your ASCII Audio Visualizer project
cp modules/ASCIIPatterns.js /path/to/your-nw_wrld-workspace/modules/

# Example:
cp modules/ASCIIPatterns.js ~/Projects/my-performance/modules/
```

## Step 2: Verify Module Loads

1. Start your nw_wrld workspace
2. Open the Dashboard
3. Look for "ASCII Patterns" in the "Audio Visual" category
4. You should see it with hot reload enabled

## Step 3: Add to Projector

In nw_wrld's Dashboard:

1. Click "ASCII Patterns" to add to your projector
2. The module will initialize with the Balance pattern running (executeOnLoad: true)
3. You should see animated ASCII art in your projector window

## Step 4: Map to Sequencer

### Example 1: Basic Pattern Sequencing

Create a simple 16-bar sequence that cycles through all patterns:

```
Timeline (bars):
0-4:   Trigger "triggerBalance"
4-8:   Trigger "triggerDuality"
8-12:  Trigger "triggerFlow"
12-16: Trigger "triggerChaos"
```

### Example 2: Build-Up with Parameters

Create a build-up using speed and density:

```
Bar 1: triggerBalance, setSpeed(0.5), setDensity(0.5)
Bar 2: setSpeed(0.7), setDensity(0.7)
Bar 3: setSpeed(1.0), setDensity(1.0)
Bar 4: setSpeed(1.5), setDensity(1.5)
Bar 5: triggerChaos, setSpeed(2.0), setDensity(2.0)  // DROP!
Bar 6: setSpeed(1.0), setDensity(1.0)                 // Settle
```

### Example 3: Pattern + Parameter Combos

```
Intro (0-8 bars):
- triggerBalance
- setSpeed(0.5)
- setDensity(0.7)
- setMouseInfluence(0.0)  // No interaction, fixed visuals

Verse (8-16 bars):
- triggerDuality
- setSpeed(1.0)
- setDensity(1.0)
- setMouseInfluence(0.3)  // Slight interaction

Chorus (16-24 bars):
- triggerFlow
- setSpeed(1.5)
- setDensity(1.5)
- setMouseInfluence(1.0)  // Full interaction for performance

Bridge (24-32 bars):
- triggerChaos
- setSpeed(1.2)
- setDensity(1.8)
- setMouseInfluence(0.5)

Outro (32-40 bars):
- triggerBalance
- setSpeed(0.3)
- setDensity(0.5)
- setMouseInfluence(0.0)  // Return to calm
```

## Step 5: MIDI/OSC Control (Optional)

If using MIDI controller with nw_wrld:

### Pattern Triggers (Note-based)
Map 4 adjacent pads/keys to trigger patterns:

```
Pad 1 (MIDI Note 60) → triggerBalance
Pad 2 (MIDI Note 61) → triggerDuality
Pad 3 (MIDI Note 62) → triggerFlow
Pad 4 (MIDI Note 63) → triggerChaos
```

### Parameter Controls (CC-based)
Map continuous controllers:

```
Knob 1 (CC 1 / Mod Wheel)     → setSpeed (0.1-2.0)
Knob 2 (CC 2 / Breath)         → setDensity (0.5-2.0)
Knob 3 (CC 74 / Filter Cutoff) → setMouseInfluence (0.0-1.0)
Button (CC 64 / Sustain Pedal) → pause (toggle)
```

## Step 6: Performance Workflow

### Pre-Show Setup
1. Load module in projector
2. Test all pattern triggers
3. Set initial state: `triggerBalance`, `setSpeed(1.0)`, `setDensity(1.0)`
4. Position mouse for interactive sections (or set influence to 0.0 for hands-free)

### During Performance

**Music Producer Approach** (mutually exclusive patterns):

1. **Use patterns like scenes**: Switch between them to mark song sections
2. **Automate parameters**: Map speed/density to song energy
3. **Live interaction**: Enable mouse influence for improvisation
4. **Hard cuts**: Use `triggerX` methods for instant pattern switches
5. **Smooth transitions**: Combine pattern change + parameter adjustment

**Example Live Performance Flow:**
```
Song Structure:        Pattern Choice:          Parameters:
----------------       ---------------          -----------
Intro (8 bars)         Balance                  Speed: 0.5, Density: 0.7
Build (4 bars)         Balance                  Speed: 0.5→1.5 (automate)
Drop (8 bars)          Flow                     Speed: 1.5, Density: 1.8
Verse (8 bars)         Duality                  Speed: 1.0, Density: 1.0
Pre-Chorus (4 bars)    Duality                  Speed: 1.0→1.5 (build)
Chorus (8 bars)        Flow                     Speed: 1.5, Density: 1.5
Breakdown (8 bars)     Chaos                    Speed: 0.8, Density: 1.2
Build (4 bars)         Chaos                    Speed: 0.8→2.0 (automate)
Drop (8 bars)          Flow                     Speed: 2.0, Density: 2.0
Outro (8 bars)         Balance                  Speed: 2.0→0.5 (fade)
```

## Step 7: Advanced Techniques

### Technique 1: Pattern as Rhythmic Element
Switch patterns on musical beats:
```
Beat 1: triggerBalance
Beat 2: triggerDuality
Beat 3: triggerFlow
Beat 4: triggerChaos
(Creates 4/4 visual rhythm)
```

### Technique 2: Parameter LFO
Use nw_wrld's automation to create cycling parameters:
```
setSpeed: 0.5 → 1.5 → 0.5 (repeating every 4 bars)
setDensity: 0.7 → 1.5 → 0.7 (repeating every 2 bars)
(Creates breathing/pulsing effect)
```

### Technique 3: Call and Response
Alternate between two patterns:
```
Bar 1-2: triggerBalance
Bar 3-4: triggerFlow
Bar 5-6: triggerBalance
Bar 7-8: triggerFlow
(Creates dialogue between patterns)
```

### Technique 4: Freeze Frame
Use pause for dramatic effect:
```
Bar 15.4: pause(true)    // Freeze on last beat
Bar 16.1: pause(false)   // Resume on downbeat
(Creates tension before drop)
```

## Troubleshooting

**Issue:** Module doesn't appear in Dashboard
- **Fix:** Check file is in correct `modules/` folder and named `ASCIIPatterns.js`

**Issue:** Pattern not changing on trigger
- **Fix:** Ensure only one trigger per pattern (they're mutually exclusive)

**Issue:** Mouse not affecting pattern
- **Fix:** Check `setMouseInfluence` is > 0.0 and mouse is over the visual

**Issue:** Animation too fast/slow
- **Fix:** Adjust `setSpeed` value (0.1 = very slow, 2.0 = very fast)

## Tips for Best Results

1. **Start Simple**: Begin with basic pattern triggers before adding parameter automation
2. **Musical Timing**: Align pattern changes with song structure (intro/verse/chorus/bridge)
3. **Parameter Range**: Stay within 0.5-1.5 for density/speed for most musical results
4. **Mouse Control**: Disable mouse influence (0.0) for fixed, repeatable visuals
5. **Visual Contrast**: Use Balance (calm) ↔ Chaos (energetic) for maximum impact

## Next Steps

- Experiment with different pattern sequences
- Map MIDI controller for live performance
- Combine with other nw_wrld modules for layered visuals
- Record your performances and review for refinement
- Share your sequences with the nw_wrld community!

---

**Resources:**
- nw_wrld Documentation: https://github.com/aagentah/nw_wrld
- ASCII Patterns README: [modules/README.md](./README.md)
- Original Project: ASCII Audio Visualizer

**Have fun creating! 🎨🎵**
