# Gevel Realism Effects Guide

## Overview

Gevel Realism Effects simulate how text would appear when projected or painted on different architectural building surfaces (gevels). These effects create atmospheric poetry presentations by making text look like it's made of various materials or affected by lighting conditions.

## System Architecture

The Gevel effects work as a **two-layer system**:

### Layer 1: 3D Transformations (Foundation)
- **Perspective** (rotationY) - gives text depth and 3D appearance
- **Z-depth** - positions text in 3D space  
- **Rotation** - rotates text in 3D space
- **Scale** - resizes text with perspective effects

### Layer 2: Gevel Effects (Realism Layer)
- **Lighting** - simulates how light falls on 3D text
- **Material Blend Modes** - makes text appear made of different materials
- **Presets** - quick combinations that simulate specific architectural surfaces

## Material Blend Modes

### How Blend Modes Work
Blend modes change how text colors mix with the background. They require:
- **Colored background** (not white or transparent)
- **Colored text** (not white on black)
- **The blend mode applied to PIXI text components**

### Available Blend Modes

| Blend Mode | Effect | Best Use Case |
|------------|--------|---------------|
| **Normal** | Standard rendering | Default, natural appearance |
| **Multiply** | Darkens text, creates shadows | Carved stone, brick inscriptions |
| **Screen** | Lightens text, creates highlights | Polished metal, reflective surfaces |
| **Overlay** | Increases contrast | Weathered stone, textured surfaces |
| **Add** | Creates glow effects | Backlit glass, neon signs |

## Gevel Presets

Pre-configured combinations of lighting and material settings that simulate specific architectural materials:

### 🧱 Brick Preset
- **Blend Mode**: Multiply (darkens text)
- **Lighting**: Enabled with moderate intensity (0.8) and ambient (0.4)
- **Effect**: Dark, shadowed text like carved into brick
- **Best With**: Light backgrounds, dark text

### 🪨 Stone Preset  
- **Blend Mode**: Overlay (enhances contrast)
- **Lighting**: High intensity (0.9), low ambient (0.3)
- **Effect**: Weathered, textured appearance like stone carving
- **Best With**: Varied backgrounds, creates texture

### ⚙️ Metal Preset
- **Blend Mode**: Screen (brightens text)
- **Lighting**: Maximum intensity (1.2), minimal ambient (0.2)
- **Effect**: Bright, reflective text like polished metal lettering
- **Best With**: Dark backgrounds, creates shine

### 🪟 Glass Preset
- **Blend Mode**: Add (creates glow)
- **Lighting**: Moderate intensity (0.6), high ambient (0.6)
- **Effect**: Translucent, glowing text like etched or backlit glass
- **Best With**: Any background, creates luminous effect

### 🪵 Wood Preset
- **Blend Mode**: Normal (natural appearance)
- **Lighting**: Balanced intensity (0.7) and ambient (0.5)
- **Effect**: Natural, warm text like carved or painted wood
- **Best With**: Natural backgrounds, subtle effects

## Usage Instructions

### Basic Setup
1. **Set Background**: Use a gevel photo or colored background (not white/transparent)
2. **Choose Text Color**: Select appropriate text color (dark for light backgrounds, light for dark)
3. **Apply 3D Effects**: Add perspective, rotation, or depth for foundation
4. **Select Material**: Choose blend mode or preset for realism

### Testing Scenarios

#### Scenario 1: Brick Wall Effect
1. Set dark gray/brown background
2. Use dark text color
3. Apply **Brick preset**
4. Result: Text appears carved into brick

#### Scenario 2: Metal Sign Effect  
1. Set dark background
2. Use light/white text
3. Apply **Metal preset**
4. Result: Text appears like polished metal lettering

#### Scenario 3: Glass Window Effect
1. Set any background
2. Use medium-colored text
3. Apply **Glass preset**  
4. Result: Text appears backlit/glowing

### Troubleshooting

#### "I don't see any effect"
- **Check background**: Must be colored, not white/transparent
- **Check text color**: Must contrast with background
- **Check 3D foundation**: Some effects work better with 3D transformations

#### "Effect is too subtle"
- **Increase lighting intensity**: Higher values create stronger effects
- **Try different blend modes**: Some work better with your color combination
- **Add 3D depth**: Z-depth and perspective enhance material effects

#### "Effect is too strong"
- **Decrease lighting intensity**: Lower values create subtler effects
- **Adjust ambient lighting**: Higher ambient reduces contrast
- **Try Normal blend mode**: For natural appearance

## Technical Implementation

### Component Integration
- **PoemLine.jsx**: Applies effects to poem text lines
- **PoemTitle.jsx**: Applies effects to poem titles  
- **PoemAuthor.jsx**: Applies effects to author names
- **Transform3DControls.jsx**: UI controls for effect settings

### PIXI Properties Applied
```javascript
<pixiText
  blendMode={global3DSettings.material.blendMode}
  alpha={lightingEffect.alpha}
  tint={lightingEffect.tint}
  // ... other 3D properties
/>
```

### Global Settings Structure
```javascript
global3DSettings: {
  globalLighting: {
    enabled: boolean,
    intensity: number (0.1-2.0),
    ambient: number (0.1-1.0)
  },
  material: {
    blendMode: string ('normal'|'multiply'|'screen'|'overlay'|'add')
  },
  gevelPreset: string ('brick'|'stone'|'metal'|'glass'|'wood'|null)
}
```

## Best Practices

### For Realistic Effects
1. **Start with 3D foundation**: Apply perspective/depth first
2. **Match materials to context**: Use appropriate presets for your scene
3. **Consider lighting direction**: Effects work best with consistent lighting
4. **Test with real backgrounds**: Use actual gevel photos for best results

### For Performance
1. **Use presets when possible**: Pre-configured for optimal performance
2. **Avoid excessive lighting intensity**: Values > 2.0 can cause performance issues
3. **Test on different devices**: Effects may vary on different hardware

### For Accessibility
1. **Maintain text readability**: Effects should enhance, not obscure text
2. **Provide contrast options**: Ensure text remains readable
3. **Test with different backgrounds**: Verify effects work across scenarios

## Future Enhancements

### Planned Features
- **Shadow casting**: Real shadow effects based on 3D position
- **Surface textures**: Actual texture overlays for materials
- **Dynamic lighting**: Light sources that move and change
- **Material physics**: More realistic material properties

### Integration Possibilities
- **Background analysis**: Automatic material detection from photos
- **AI enhancement**: Machine learning for optimal effect selection
- **Real-time rendering**: Hardware-accelerated 3D effects