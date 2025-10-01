# Requirements Document

## Introduction

This specification addresses a critical bug in the existing 3D transformation system where global 3D effects (Gevel Realism Effects) do not function when no text lines are selected. The 3D transformation foundation exists and works for selected lines, but global effects are incorrectly implemented, causing them to have no visual impact.

## Requirements

### Requirement 1

**User Story:** As a user, I want global 3D effects to work when no lines are selected, so that I can apply scene-wide transformations to create atmospheric effects.

#### Acceptance Criteria

1. WHEN no lines are selected AND I adjust lighting controls THEN the lighting effects SHALL be applied to all text elements
2. WHEN no lines are selected AND I change material blend modes THEN the blend mode SHALL be applied globally
3. WHEN no lines are selected AND I select a Gevel preset THEN the preset effects SHALL be visible on all text
4. WHEN I toggle lighting enabled/disabled THEN the visual change SHALL be immediately apparent
5. WHEN I adjust lighting intensity or ambient values THEN the text appearance SHALL update in real-time

### Requirement 2

**User Story:** As a user, I want the 3D controls interface to be consistent and error-free, so that I can use the features without encountering bugs or typos.

#### Acceptance Criteria

1. WHEN I click any Gevel preset button THEN the button SHALL execute without JavaScript errors
2. WHEN I interact with global 3D controls THEN the state SHALL be managed through the correct global handlers
3. WHEN I switch between per-line and global 3D modes THEN the appropriate controls SHALL be displayed
4. WHEN global 3D settings change THEN the changes SHALL persist and be reflected in the UI

### Requirement 3

**User Story:** As a developer, I want the 3D transformation system to use the correct state management patterns, so that the code is maintainable and functions as designed.

#### Acceptance Criteria

1. WHEN global 3D effects are modified THEN they SHALL use `onGlobal3DSettingChange` handler
2. WHEN per-line effects are modified THEN they SHALL use `handleSelectedTransformChange` handler  
3. WHEN Transform3DControls component renders THEN it SHALL receive all required props for both modes
4. WHEN global 3D settings are accessed THEN they SHALL read from `global3DSettings` state
5. WHEN the component initializes THEN there SHALL be no missing prop warnings or runtime errors