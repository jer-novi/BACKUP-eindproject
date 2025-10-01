# Refactoring Plan: `Controls.jsx`

This document outlines the plan to refactor the monolithic `Controls.jsx` component into smaller, more manageable sub-components.

## 1. Analysis of `Controls.jsx`

The existing `Controls.jsx` component is responsible for managing all styling and transformation controls for the canvas. It has grown too large, making it difficult to maintain and modify. The component is already divided into logical sections using headers, which will serve as the basis for our refactoring.

The main sections identified are:
-   **🖼️ Achtergrond (Background):** Handles background image searching, city-based searches, and displaying results.
-   **✒️ Font & Stijl (Font & Style):** Manages font family, weight, style, size, letter spacing, and a complex color system (global, title, author, and per-line).
-   **📐 Layout & Positie (Layout & Position):** Controls line height, text alignment, camera/viewport controls, text optimization, and global container skew. It also includes a "Scène Setup" subsection for global 3D perspective.
-   **🎭 3D Transformaties (3D Transformations):** Manages per-line 3D effects like rotation, scale, pivot points, depth (Z-axis), and advanced "Gevel Realism Effects".

## 2. Proposed New File Structure

A new directory will be created to house the new sub-components:

```
src/
└── pages/
    └── CanvasPage/
        ├── components/
        │   └── controls/
        │       ├── BackgroundControls.jsx
        │       ├── FontControls.jsx
        │       ├── LayoutControls.jsx
        │       ├── Transform3DControls.jsx
        │       └── shared/
        │           ├── ControlSection.jsx
        │           └── ColorSubSection.jsx
        └── Controls.jsx  // This will become the container component
```

-   `Controls.jsx` will be simplified into a container that fetches and manages state, passing props down to the new child components.
-   The `controls/` directory will contain the new, focused components.
-   A `shared/` directory is proposed for reusable UI elements, like the collapsible `ControlSection` wrapper and the `ColorSubSection`.

## 3. Component Breakdown & Prop Specification

### A. `Controls.jsx` (Container Component)

This file will retain the main state management and logic but will delegate the rendering of UI controls to the new sub-components.

**Responsibilities:**
-   Maintain all state (`useState`, `useMemo`).
-   Define all event handlers (`handleSearchClick`, `handleColorInput`, etc.).
-   Render the main layout and pass props to the child control components.

### B. `BackgroundControls.jsx`

**UI Section:** "🖼️ Achtergrond"

**Responsibilities:**
-   Render the background search input, city dropdowns, and action buttons.
-   Display loading and error states related to background search.

**Props to Receive:**
```jsx
{
  // State
  query,
  setQuery,
  isFreeSearchVisible,
  setIsFreeSearchVisible,
  selectedAnwbCity,
  setSelectedAnwbCity,
  selectedCapital,
  setSelectedCapital,
  isLoading,
  error,
  hoverFreezeActive,

  // Handlers
  onSearch,
  onOpenPhotoGrid,
  onCitySearch,
  onResetToCollection,
  handleSearchClick,
  handleDropdownSearch
}
```

### C. `FontControls.jsx`

**UI Section:** "✒️ Font & Stijl"

**Responsibilities:**
-   Render controls for font family, style (bold/italic), global font size, and per-line font size.
-   Render controls for letter spacing.
-   Render the color subsection for global, title, author, and per-line colors.

**Props to Receive:**
```jsx
{
  // State & Derived Values
  availableFonts,
  displayedFontFamily,
  fontWeight,
  fontStyle,
  fontSize,
  hasSelection,
  selectionCount,
  displayedFontSize,
  displayedLetterSpacing,
  
  // Color System State
  displayedColor,
  effectiveTitleColor,
  hasTitleColorOverride,
  effectiveAuthorColor,
  hasAuthorColorOverride,

  // Handlers
  onFontFamilyChange,
  onFontWeightChange,
  onFontStyleChange,
  onFontSizeChange,
  onLineFontSizeChange,
  onLetterSpacingChange,
  onLineLetterSpacingChange,
  
  // Color System Handlers
  handleColorInput,
  onColorPickerActiveChange,
  handleResetSelectedLines,
  onTitleColorChange,
  onResetTitleColor,
  onAuthorColorChange,
  onResetAuthorColor
}
```

### D. `LayoutControls.jsx`

**UI Section:** "📐 Layout & Positie"

**Responsibilities:**
-   Render controls for line height, text alignment, and camera (viewport).
-   Render the text optimization toggle.
-   Render the global skew controls.
-   Render the "Scène Setup" subsection for global 3D perspective and Auto-Z preview.

**Props to Receive:**
```jsx
{
  // State & Derived Values
  lineHeightMultiplier,
  fontSize,
  textAlign,
  viewportDragEnabled,
  isOptimizationEnabled,
  skewX,
  skewY,
  skewZ,
  global3DSettings,
  autoZPreview,
  
  // Handlers
  onLineHeightMultiplierChange,
  onResetLineHeight,
  onTextAlignChange,
  onViewportToggle,
  onResetViewport,
  setIsOptimizationEnabled,
  onSkewXChange,
  onSkewYChange,
  onSkewZChange,
  onGlobal3DSettingChange,
  
  // Auto-Z Handlers & State
  setAutoZPreview,
  lineTransforms,
  onLineTransformChange,
  originalZValues,
  setOriginalZValues
}
```

### E. `Transform3DControls.jsx`

**UI Section:** "🎭 3D Transformaties"

**Responsibilities:**
-   Render per-line 3D transformation controls (rotation, scale, pivot, Z-depth).
-   Render "Gevel Realism Effects" controls.
-   Only render its content when `hasSelection` is true.

**Props to Receive:**```jsx
{
  // State & Derived Values
  hasSelection,
  selectionCount,
  
  // 3D Helper Functions
  getSelectedTransformValue,
  handleSelectedTransformChange,
  handleReset3DTransforms
}
```

## 4. Implementation Steps

1.  Create the new directory structure: `src/pages/CanvasPage/components/controls/` and `.../shared/`.
2.  Create the new empty component files: `BackgroundControls.jsx`, `FontControls.jsx`, `LayoutControls.jsx`, `Transform3DControls.jsx`.
3.  Move the relevant JSX and logic from `Controls.jsx` into each new component file.
4.  Update the main `Controls.jsx` to import and render the new components, passing the specified props.
5.  Refactor the collapsible section logic into a reusable `ControlSection.jsx` component to reduce boilerplate.
6.  (Optional) Refactor the color controls into a `ColorSubSection.jsx` component.
7.  Test thoroughly to ensure all controls function as before.

This refactoring will result in a cleaner, more maintainable, and scalable control panel structure.