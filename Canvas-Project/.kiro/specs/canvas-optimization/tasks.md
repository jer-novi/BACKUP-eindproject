# Implementation Plan

- [ ] 1. Set up text rendering optimization infrastructure

  - Create TextCache class for texture caching with LRU eviction policy
  - Implement enhanced text rendering configuration with higher resolution settings
  - Add text quality metrics and performance monitoring utilities
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Implement improved font loading system

  - Refactor useFontLoader hook to support preloading and fallback chains
  - Add retry logic with exponential backoff for failed font loads
  - Create font validation and error handling utilities
  - Write unit tests for font loading edge cases and error scenarios
  - _Requirements: 1.1, 3.2, 4.3_

- [x] 3. Create 3D transformation system foundation




  - Implement Transform3D interface and data structures
  - Create Transform3DManager class with perspective calculation methods
  - Add 3D matrix transformation utilities for Pixi.js display objects
  - Write unit tests for 3D math calculations and edge cases
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Integrate Z-axis and perspective controls

  - Add Z-axis state management to useCanvasState hook
  - Create perspective controls in the Controls component UI
  - Implement depth sorting logic for multiple text objects
  - Add visual feedback for 3D positioning changes
  - _Requirements: 2.1, 2.3, 2.4_

- [-] 5. Implement third skew axis (skewZ)

  - Add skewZ property to canvas state and text components
  - Create skewZ control slider in the Controls component
  - Integrate skewZ transformations with existing skewX/skewY system
  - Write integration tests for combined 3D transformations
  - _Requirements: 2.2, 2.3_

- [-] 5b. Enhanced Per-Text Controls
  - Add per-line rotation controls (0-360°)
  - Add per-line scale controls (0.5x-2.0x)
  - Add pivot point selection (center/top/bottom)
  - Integrate with existing container skew system

 - [-]  Task 5c: Gevel Realism Effects
  - Add lighting simulation (alpha/tint per line)
  - Add perspective depth effects (rotationY)
  - Add material blend modes for surface simulation
  - Create gevel preset configurations

-  Optional task: Optimize text rendering performance

  - Implement texture caching in PoemLine, PoemTitle, and PoemAuthor components
  - Add batch text update system to reduce render calls
  - Implement viewport culling to hide off-screen text objects
  - Create performance monitoring and FPS tracking utilities
  - _Requirements: 1.2, 5.5_

- [ ] 7. Conduct code cleanup and dead code removal

  - Run ESLint analysis to identify unused imports and variables
  - Remove commented-out code and unused utility functions
  - Eliminate duplicate code patterns and consolidate similar functions
  - Clean up unused CSS classes and style definitions
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 8. Modernize JavaScript patterns and syntax

  - Replace any remaining var declarations with const/let
  - Convert function declarations to arrow functions where appropriate
  - Implement modern async/await patterns for asynchronous operations
  - Add optional chaining and nullish coalescing where beneficial
  - _Requirements: 4.2, 4.3_

- [ ] 9. Update and optimize dependency usage

  - Verify all dependencies are at latest compatible versions
  - Optimize import statements to use tree-shaking where possible
  - Update Pixi.js usage to leverage v8 performance improvements
  - Ensure React 19 features are used appropriately throughout codebase
  - _Requirements: 4.1, 4.4_

- [ ] 10. Implement comprehensive error handling

  - Add error boundaries for text rendering failures
  - Implement graceful degradation for 3D transform errors
  - Create user-friendly error messages and recovery options
  - Add error logging and debugging utilities for development
  - _Requirements: 3.2, 5.5_

- [ ] 11. Add performance optimization features

  - Implement object pooling for frequently created/destroyed text objects
  - Add memory management utilities with automatic cleanup
  - Create performance profiling tools for identifying bottlenecks
  - Implement adaptive quality settings based on device performance
  - _Requirements: 1.2, 5.5_

- [ ] 12. Create comprehensive test suite

  - Write unit tests for all new text rendering optimization functions
  - Add integration tests for 3D transformation system
  - Create performance benchmarks for text rendering and transformations
  - Implement visual regression tests for text quality verification
  - _Requirements: 5.4, 5.5_

- [ ] 13. Add code documentation and comments

  - Document all new classes, methods, and complex algorithms
  - Add JSDoc comments for public APIs and interfaces
  - Create inline comments explaining 3D math and optimization logic
  - Update README with new features and performance characteristics
  - _Requirements: 5.3, 5.4_

- [ ] 14. Refactor oversized components for maintainability

  - Break down large components (CanvasPage, CanvasContent) into smaller, focused modules
  - Extract reusable UI components from Controls and Navigation components
  - Create dedicated components for complex features like photo grid and sliders
  - Ensure each component has a single responsibility and clear interface
  - _Requirements: 3.2, 5.4_

- [ ] 15. Consolidate keyboard shortcut logic

  - Verify useKeyboardShortcuts hook handles all keyboard interactions centrally
  - Remove any scattered keyboard event handlers from individual components
  - Ensure consistent keyboard shortcut behavior across all canvas modes
  - Add comprehensive keyboard shortcut documentation and help system
  - _Requirements: 3.2, 4.3, 5.3_

- [ ] 16. Verify and enhance Playwright test suite

  - Run existing Playwright tests to identify any failures after refactoring
  - Update test cases to cover new 3D transformation features
  - Add critical test cases for text rendering optimization and performance
  - Ensure all user interaction flows are covered by automated tests
  - _Requirements: 5.4, 5.5_

- [ ] 17. Create comprehensive test documentation

  - Write docs/test-instructions/README.md explaining Playwright integration
  - Document how to run, interpret, and debug test results
  - Create guidelines for writing new tests for canvas features
  - Establish workflow for generating test outlines with each commit
  - _Requirements: 5.3, 5.4_

- [ ] 18. Integrate and test complete optimization system
  - Wire together all optimization components in CanvasContent
  - Test complete workflow with multiple poems and 3D transformations
  - Verify performance targets are met under various load conditions
  - Conduct final code review and quality assurance checks
  - _Requirements: 5.1, 5.2, 5.5_
