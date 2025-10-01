# Implementation Plan

- [x] 1. Fix Transform3DControls prop passing and handler usage

  - Update Controls component to pass missing `global3DSettings` and `onGlobal3DSettingChange` props to Transform3DControls
  - Fix Transform3DControls to receive and use the global 3D props for Gevel Realism Effects section
  - Fix typo: change `thandleSelectedTransformChange` to `handleSelectedTransformChange` in Metal preset button
  - _Requirements: 2.1, 3.1, 3.2, 3.3_

- [x] 2. Implement correct handler usage in Gevel Realism Effects

  - Replace all `handleSelectedTransformChange` calls with `onGlobal3DSettingChange` calls in the Gevel Realism Effects section
  - Replace all `getSingleValue` calls with direct `global3DSettings` property access in the Gevel Realism Effects section
  - Update lighting controls to use global handlers instead of per-line handlers
  - Update material blend mode controls to use global handlers instead of per-line handlers
  - _Requirements: 1.1, 1.2, 3.1, 3.4_

- [x] 3. Add per-line lighting controls to Enhanced Per-Text Controls

  - Add "Enable Fine-grained Lighting (per regel)" checkbox to Enhanced Per-Text Controls section
  - Add per-line lighting intensity slider (0-2, step 0.1) when per-line lighting is enabled
  - Add per-line ambient light slider (0-1, step 0.1) when per-line lighting is enabled
  - Implement additive lighting system where global and per-line lighting can work together

  - Add warning indicator text when both global and per-line lighting are enabled: "Het kan dat sommige regels al minimale/maximale lichtintensiteit ambient light hebben als je finegrained met global lighting combineert"
  - Update lighting property names to use consistent naming (e.g., "lighting.enabled", "lighting.intensity", "lighting.ambient")
  - _Requirements: 1.1, 1.2, 2.1, 3.1_

- [x] 4. Implement Gevel preset functionality with global handlers




  - Create preset configuration objects for brick, stone, metal, glass, and wood materials
  - Update all Gevel preset buttons to use `onGlobal3DSettingChange` instead of `handleSelectedTransformChange`
  - Implement preset application logic that sets multiple global 3D properties at once
  - Add visual feedback when presets are applied
  - _Requirements: 1.3, 2.1, 3.1_

- [ ] 5. Enhance global 3D effects rendering in PoemLine component

  - Verify that PoemLine correctly applies global lighting effects when `global3DSettings.globalLighting.enabled` is true
  - Ensure material blend modes from global settings are applied to PIXI text elements
  - Implement additive lighting system that combines global and per-line lighting effects
  - Implement tint overlay system for material effects while preserving existing style.fill colors
  - Add console logging for debugging global 3D effects application
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [ ] 6. Add error handling and validation

  - Add PropTypes or default values for `global3DSettings` and `onGlobal3DSettingChange` props
  - Implement null checks before accessing nested global3DSettings properties
  - Add console warnings in development mode when required props are missing
  - Ensure graceful fallback when global 3D handlers are undefined
  - _Requirements: 2.2, 3.5_

- [ ] 7. Test and verify global 3D effects functionality
  - Test that lighting controls work when no lines are selected
  - Test that material blend modes apply correctly when no lines are selected
  - Test that per-line lighting controls work when lines are selected
  - Test that additive lighting system works correctly when both global and per-line lighting are enabled
  - Test that all Gevel presets trigger visible changes when no lines are selected
  - Verify that switching between per-line and global modes works correctly
  - Test that global effects persist when switching between modes
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.3, 2.4_
