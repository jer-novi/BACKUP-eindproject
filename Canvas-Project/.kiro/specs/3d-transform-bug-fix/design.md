# Design Document

## Overview

This design addresses a critical bug in the 3D transformation system where global effects don't work when no lines are selected. The issue stems from incorrect prop passing and handler usage in the Transform3DControls component. The existing 3D foundation is solid, but the global effects implementation has a fundamental flaw in its state management approach.

### Visual Effect Goals

**Gevel Realism Effects** simulate how text would appear when projected or painted on different building surfaces (gevels):

- **Lighting**: Simulates how light hits text on a wall (shadows, highlights, depth perception)
- **Material Blend Modes**: Makes text appear as if it's made of different materials (stone carving, metal lettering, glass etching)
- **Gevel Presets**: Quick combinations that simulate specific architectural surfaces

**When to use:**
- Creating atmospheric poetry presentations
- Simulating text on building facades for architectural visualization
- Adding realistic depth and material effects to enhance readability and mood

## Architecture

The 3D transformation system has two distinct modes:
1. **Per-line mode**: When lines are selected, individual transforms are applied via `lineTransforms` state
2. **Global mode**: When no lines are selected, scene-wide effects are applied via `global3DSettings` state

Currently, the global mode incorrectly attempts to use per-line handlers, causing the effects to have no impact.

## Components and Interfaces

### Transform3DControls Component

**Current Props (Incomplete):**
```javascript
{
  hasSelection,
  selectionCount,
  getSelectedTransformValues,
  handleSelectedTransformChange,
  handleReset3DTransforms,
  transform3DSectionOpen,
  setTransform3DSectionOpen
}
```

**Required Props (Complete):**
```javascript
{
  // Existing props
  hasSelection,
  selectionCount,
  getSelectedTransformValues,
  handleSelectedTransformChange,
  handleReset3DTransforms,
  transform3DSectionOpen,
  setTransform3DSectionOpen,
  
  // Missing props for global mode
  global3DSettings,
  onGlobal3DSettingChange
}
```

### Controls Component

The Controls component needs to pass the missing props to Transform3DControls:

```javascript
<Transform3DControls
  // ... existing props
  global3DSettings={global3DSettings}
  onGlobal3DSettingChange={onGlobal3DSettingChange}
/>
```

### Handler Function Mapping

**Per-line Mode (hasSelection = true):**
- Use: `handleSelectedTransformChange(property, value)`
- Affects: `lineTransforms[selectedLineIndex][property]`

**Global Mode (hasSelection = false):**
- Use: `onGlobal3DSettingChange(property, value)`
- Affects: `global3DSettings[property]`

## Data Models

### Global 3D Settings Structure

```javascript
global3DSettings: {
  perspective: 1000,
  globalLighting: {
    enabled: false,
    intensity: 1.0,
    ambient: 0.3,
    direction: { x: 0, y: 0, z: 1 }
  },
  material: {
    blendMode: 'normal'
  },
  gevelPreset: null
}
```

### Gevel Preset Configurations

Each preset simulates how text appears on different architectural surfaces:

```javascript
const GEVEL_PRESETS = {
  brick: {
    // Darker, more shadowed text like carved into brick
    lighting: { enabled: true, intensity: 0.8, ambient: 0.4 },
    material: { blendMode: 'multiply' } // Darkens text, creates shadow effect
  },
  stone: {
    // Weathered, textured appearance like stone carving
    lighting: { enabled: true, intensity: 0.9, ambient: 0.3 },
    material: { blendMode: 'overlay' } // Enhances contrast, stone-like texture
  },
  metal: {
    // Bright, reflective text like polished metal lettering
    lighting: { enabled: true, intensity: 1.2, ambient: 0.2 },
    material: { blendMode: 'screen' } // Brightens text, metallic shine
  },
  glass: {
    // Translucent, glowing text like etched or backlit glass
    lighting: { enabled: true, intensity: 0.6, ambient: 0.6 },
    material: { blendMode: 'add' } // Creates glow effect, glass-like transparency
  },
  wood: {
    // Natural, warm text like carved or painted wood
    lighting: { enabled: true, intensity: 0.7, ambient: 0.5 },
    material: { blendMode: 'normal' } // Natural appearance with subtle lighting
  }
};
```

### Visual Effects Explanation

**Lighting Effects:**
- **Intensity**: How strong the directional light is (higher = more dramatic shadows/highlights)
- **Ambient**: Base light level (higher = less contrast, softer appearance)
- **Enabled**: Toggles the entire lighting system on/off

**Material Blend Modes (PIXI Properties):**
- **Normal**: Standard text appearance (`blendMode: 'normal'`)
- **Multiply**: Darkens text, creates shadow/carved effect (`blendMode: 'multiply'`)
- **Overlay**: Enhances contrast, adds texture (`blendMode: 'overlay'`)
- **Screen**: Brightens text, creates shine/glow (`blendMode: 'screen'`)
- **Add**: Creates bright glow, transparency effect (`blendMode: 'add'`)

**PIXI Implementation Details:**

Currently, text color is set via `style.fill` (not `tint`), which is why you don't see tint values in PIXI DevTools.

**Current text color approach:**
```javascript
style: {
  fill: '#ffffff',  // Text color via style.fill
  fontSize: 24,
  // ... other style properties
}
```

**3D Effects approach:**
- **Lighting effects** modify `alpha` property (transparency/brightness)
- **Material effects** modify `blendMode` property (how colors mix)
- **Advanced effects** could add `tint` property (color overlay on top of style.fill)

**Implementation Strategy:**
1. Keep existing `style.fill` for base text color
2. Add `tint` property for material color effects (optional enhancement)
3. Use `alpha` for lighting intensity effects
4. Use `blendMode` for material surface simulation

Example PIXI properties for "metal" preset:
```javascript
{
  alpha: 0.9,           // Lighting effect: slightly dimmed
  tint: 0xC0C0C0,      // Material effect: silver overlay (optional)
  blendMode: 'screen'   // Material effect: brightening blend for shine
}
```

### Color System Integration Strategy

**Three possible approaches:**

**Option A: Keep Both Systems Separate (Recommended)**
- `style.fill` = base text color (color picker)
- `tint` = material effect overlay (3D effects)
- `alpha` + `blendMode` = lighting/material effects

**Option B: Migrate to Tint-Only System**
- Convert all color picker values to `tint` property
- Requires refactoring entire color management system
- More complex migration, higher risk

**Option C: Hybrid Conversion**
- Convert `style.fill` to `tint` on render
- Keep color picker interface unchanged
- Add material tint as secondary overlay

**Recommended Approach: Option A**

Keep the existing color picker system (`style.fill`) and add `tint` as an optional overlay for material effects. This allows:

1. **Backward compatibility**: All existing colors continue to work
2. **Minimal changes**: No need to refactor color picker system  
3. **Flexible effects**: Material tint can be applied on top of base color
4. **Clear separation**: Base color vs. material effect

**Implementation:**
```javascript
// Base color (unchanged)
style: {
  fill: colorFromColorPicker, // e.g., '#ff0000'
}

// Material effects (new)
tint: materialTint,     // e.g., 0xC0C0C0 for metal
alpha: lightingAlpha,   // e.g., 0.8 for shadows
blendMode: materialBlend // e.g., 'screen' for shine
```

This way, a red text with metal effect would be red metal, blue text would be blue metal, etc.

## Error Handling

### Prop Validation
- Add PropTypes or TypeScript interfaces to ensure required props are passed
- Implement fallback values for missing global3DSettings properties
- Add console warnings for development when props are missing

### Runtime Error Prevention
- Fix the typo: `thandleSelectedTransformChange` → `handleSelectedTransformChange`
- Add null checks before accessing nested properties
- Ensure handlers exist before calling them

### State Consistency
- Validate that global3DSettings structure matches expected format
- Provide default values for undefined properties
- Ensure state updates trigger re-renders correctly

## Testing Strategy

### Unit Tests
- Test Transform3DControls with both hasSelection true/false
- Verify correct handler functions are called in each mode
- Test prop passing from Controls to Transform3DControls

### Integration Tests
- Test global lighting effects are visible when no lines selected
- Test material blend modes apply correctly
- Test Gevel presets trigger appropriate visual changes
- Test switching between per-line and global modes

### Visual Regression Tests
- Capture screenshots of global 3D effects in action
- Compare before/after states when toggling lighting
- Verify Gevel presets produce expected visual results

## Implementation Notes

### Critical Bug Fixes Required

1. **Prop Passing**: Controls component must pass `global3DSettings` and `onGlobal3DSettingChange` to Transform3DControls

2. **Handler Usage**: Gevel Realism Effects section must use global handlers instead of per-line handlers

3. **Typo Fix**: Correct `thandleSelectedTransformChange` to `handleSelectedTransformChange` in Metal preset button

4. **State Access**: Global effects must read from and write to `global3DSettings` state, not attempt to use `getSelectedTransformValues` with no selection

### Performance Considerations
- Global 3D effects should update all text elements efficiently
- Avoid unnecessary re-renders when switching between modes
- Cache computed 3D transformations where possible