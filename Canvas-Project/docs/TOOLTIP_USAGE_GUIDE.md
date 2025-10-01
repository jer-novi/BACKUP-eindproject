# Tooltip Usage Guide

## Overview

The application now includes a reusable Tooltip component that can be used throughout the interface to provide helpful information and guidance to users.

## Basic Usage

```jsx
import Tooltip from '../components/common/Tooltip';

// Simple tooltip
<Tooltip content="This button saves your work">
  <button>Save</button>
</Tooltip>

// Tooltip with custom position
<Tooltip content="Adjust the brightness" position="right">
  <input type="range" />
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Element that triggers the tooltip |
| `content` | string | - | Tooltip text content |
| `position` | string | 'top' | Position: 'top', 'bottom', 'left', 'right' |
| `delay` | number | 500 | Delay before showing tooltip (ms) |
| `disabled` | boolean | false | Disable tooltip |
| `className` | string | '' | Additional CSS classes |

## Current Implementation

### Transform3D Controls
The 3D transformation controls now include helpful tooltips:

- **Material Blend Mode**: Explains how blend modes work and what each option does
- **Global Lighting**: Describes lighting effects and best practices
- **3D Controls**: Explains rotation, scaling, perspective, and depth effects
- **Gevel Presets**: Describes each material preset and its intended use

### Tooltip Content Examples

#### Blend Modes
- **Normal**: "Standard rendering, natural appearance"
- **Multiply**: "Darkens text, creates shadows - good for carved stone effect"
- **Screen**: "Lightens text, creates highlights - good for polished metal"
- **Overlay**: "Increases contrast, weathered texture - good for stone carving"
- **Add**: "Creates glow effects - good for backlit glass or neon"

#### 3D Controls
- **Rotation**: "Rotates selected text lines around their pivot point"
- **Scale**: "Resizes selected text lines. Combines with 3D perspective for realistic depth effects"
- **Z-depth**: "Moves text forward/backward in 3D space"
- **Perspective**: "Tilts text in 3D space to create perspective effects"

## Expanding Tooltips Throughout the App

### Recommended Areas for Tooltips

1. **Font Controls**
   - Font family selector
   - Font size and line height controls
   - Font weight and style options

2. **Color Controls**
   - Color picker functionality
   - Global vs per-line color settings
   - Color sync options

3. **Layout Controls**
   - Text alignment options
   - Spacing controls
   - Container transformations

4. **Background Controls**
   - Photo search functionality
   - Background positioning
   - Blend modes for backgrounds

5. **Export/Save Options**
   - File format explanations
   - Quality settings
   - Export dimensions

### Implementation Strategy

#### Phase 1: Critical Controls
Add tooltips to the most confusing or powerful features first:
- 3D transformation controls ✅ (Done)
- Blend mode selectors ✅ (Done)
- Complex multi-option controls

#### Phase 2: Secondary Controls
Add tooltips to intermediate features:
- Font and typography controls
- Color management systems
- Layout and positioning

#### Phase 3: Basic Controls
Add tooltips to basic features for completeness:
- Simple buttons and toggles
- Navigation elements
- Status indicators

## Best Practices

### Content Guidelines
1. **Be Concise**: Keep tooltip text under 50 words when possible
2. **Be Specific**: Explain what the control does, not just what it is
3. **Include Context**: Mention when/why to use the feature
4. **Use Examples**: Reference specific use cases when helpful

### Technical Guidelines
1. **Performance**: Use `disabled={true}` for tooltips that aren't needed
2. **Accessibility**: Tooltips work with keyboard navigation (focus/blur)
3. **Responsive**: Tooltips adjust for mobile devices
4. **Positioning**: Choose positions that don't cover important content

### UX Guidelines
1. **Delay**: 500ms default delay prevents accidental triggers
2. **Consistency**: Use similar language patterns across tooltips
3. **Progressive Disclosure**: More complex features get more detailed tooltips
4. **Visual Hierarchy**: Use ℹ️ emoji to indicate tooltip availability

## Examples for Different Control Types

### Dropdown/Select Controls
```jsx
<Tooltip content="Choose how text colors blend with the background">
  <select>
    <option>Normal</option>
    <option>Multiply</option>
  </select>
</Tooltip>
```

### Slider Controls
```jsx
<Tooltip content="Higher values create stronger lighting effects" position="top">
  <input type="range" min="0" max="2" step="0.1" />
</Tooltip>
```

### Button Groups
```jsx
<Tooltip content="Quick presets for different architectural materials">
  <div className="buttonGroup">
    <button>Brick</button>
    <button>Stone</button>
    <button>Metal</button>
  </div>
</Tooltip>
```

### Complex Controls
```jsx
<Tooltip 
  content="Enables realistic lighting simulation. Works best with 3D transformations and colored backgrounds."
  position="right"
>
  <label>
    <input type="checkbox" />
    Enable Global Lighting
  </label>
</Tooltip>
```

## Future Enhancements

### Planned Features
- **Rich Content**: Support for HTML content in tooltips
- **Interactive Tooltips**: Tooltips that can contain buttons or links
- **Smart Positioning**: Automatic position adjustment based on viewport
- **Tooltip Groups**: Related tooltips that can be navigated sequentially

### Integration Ideas
- **Help System**: Connect tooltips to comprehensive help documentation
- **Onboarding**: Use tooltips for guided tours of features
- **Context Awareness**: Show different tooltips based on current mode/state
- **User Preferences**: Allow users to disable/customize tooltip behavior