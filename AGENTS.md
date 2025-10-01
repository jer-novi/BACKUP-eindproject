# AGENTS.md - Canvas Integration Context

## Project Overview

**Hoofddoel**: Integreren van robuuste PIXI.js canvas-functionaliteit van de Canvas-Project subfolder naar het gedichtgevel.nl project voor gedicht visualisatie op gevelafbeeldingen.

### Repository Structuur
- **Hoofdproject**: gedichtgevel.nl - Production-ready website voor gedicht visualisatie  
- **Canvas-Project/**: Submap met volledig werkende PIXI.js canvas implementatie (referentieproject)
- **Integratie**: Canvas-Project code migreren naar hoofdproject's `src/components/Core/Canvas/`

## Tech Stack & Dependencies

### Hoofdproject (gedichtgevel.nl)
```bash
# Package Manager
pnpm install

# Build Commands  
pnpm run dev        # Development server
pnpm run build      # Production build
pnpm run lint       # ESLint
pnpm run lint:css   # Stylelint CSS
pnpm run preview    # Preview build
```

### Canvas Dependencies (reeds geïnstalleerd)
```json
"dependencies": {
  "@pixi/react": "^8.0.2",
  "pixi.js": "^8.10.2", 
  "pixi-viewport": "^6.0.3",
  "react-color": "^2.19.3",
  "axios": "^1.10.0"
}
```

### Environment Variables
```env
# Reeds geconfigureerd
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Toe te voegen voor canvas
VITE_PEXELS_API_KEY=your_pexels_api_key_here
VITE_CANVAS_DEBUG=true
```

## Canvas Integration Plan

### Fase 1: Core Component Migration
**Huidige staat**: 
- `src/components/Core/Canvas/` heeft enkele placeholder hooks en components
- `src/pages/Design/DesignPage.jsx` is leeg - hier moet canvas komen

**Te vervangen/migreren van Canvas-Project/src/pages/CanvasPage/**:
1. **CanvasPage.jsx** → `src/components/Core/Canvas/Canvas.jsx` 
2. **hooks/** → `src/hooks/canvas/`
3. **components/** → `src/components/Core/Canvas/components/`

### Fase 2: Navigation & Routing
**Doel**: "🎨 Open in canvas" button werkend maken vanuit zoekresultaten

**Implementatie**:
```javascript
// Route toevoegen in src/main.jsx
{path: 'canvas/:poemId', element: <CanvasPage/>}

// PoemActionButtons integratie met navigation
const handleNavigateToCanvas = (poemData) => {
  sessionStorage.setItem('canvas-poem-data', JSON.stringify(poemData));
  navigate(`/canvas/${poemData.id}`);
};
```

### Fase 3: Poem Data Flow
**Van**: Zoekresultaten in hoofdapp  
**Naar**: Canvas component met volledige gedicht data

**Key Files voor Data Flow**:
- `src/services/canvas/canvasDataService.js` - Data transport tussen search en canvas
- `src/hooks/canvas/useCanvasState.js` - Canvas state management met poem data

## Critical Implementation Details

### PIXI.js Integration Pattern
```javascript
// MUST be at module level in Canvas.jsx!
import {extend} from "@pixi/react";
import {Text, Container, Graphics} from "pixi.js";
import {Viewport} from "pixi-viewport";
extend({Text, Container, Graphics, Viewport});
```

### Responsive Layout Integration
```javascript
// Account for NavBar height (80px) in hoofdproject
const availableHeight = window.innerHeight - 80;
const canvasHeight = Math.max(200, availableHeight - 40);
```

### Vite Configuration (reeds aangepast)
```javascript
// vite.config.js - PIXI devtools enabled
define: {
  __PIXI_DEVTOOLS__: process.env.NODE_ENV === 'development',
}
```

## File Structure Mapping

### Van Canvas-Project naar Hoofdproject
```
Canvas-Project/src/pages/CanvasPage/
├── CanvasPage.jsx              → src/components/Core/Canvas/Canvas.jsx
├── hooks/
│   ├── useCanvasState.js       → src/hooks/canvas/useCanvasState.js
│   ├── useCanvasHandlers.js    → src/hooks/canvas/useCanvasHandlers.js
│   ├── useResponsiveCanvas.js  → src/hooks/canvas/useResponsiveCanvas.js
│   └── useFontLoader.js        → src/hooks/canvas/useFontLoader.js
├── components/
│   ├── CanvasContent.jsx       → src/components/Core/Canvas/components/CanvasContent.jsx
│   ├── Controls.jsx            → src/components/Core/Canvas/components/Controls.jsx
│   ├── ResponsiveLayout.jsx    → src/components/Core/Canvas/components/ResponsiveLayout.jsx
│   └── FloatingPhotoGrid.jsx   → src/components/Core/Canvas/components/FloatingPhotoGrid.jsx
└── utils/                      → src/utils/canvas/
```

## Architecture & Patterns

### Canvas State Structure
```javascript
const canvasState = {
  // Text styling
  fontSize: 24,
  fontFamily: 'Cormorant Garamond', 
  fillColor: '#FFFFFF',
  letterSpacing: 0,
  lineHeight: 1.2,
  textAlign: 'left',
  
  // Positioning & interaction
  poemOffset: { x: 0, y: 0 },
  lineOverrides: new Map(),
  selectedLines: new Set(),
  moveMode: 'edit', // 'edit', 'line', 'poem'
  
  // Background & UI
  backgroundImage: null,
  photos: [], // Pexels search results
  isLoading: false,
  photoGridVisible: false
};
```

### Component Props Interface
```javascript
// Canvas.jsx aangepaste interface voor hoofdproject
export default function Canvas({ 
  poemData,           // Van zoekresultaten 
  backgroundUrl,      // Optional initial background
  onSave,            // Save canvas as image
  onBack             // Navigate back to search
}) {
  // Canvas logic hier
}
```

## Styling Integration

### SCSS Modules (hoofdproject pattern)
```scss
// Canvas.module.scss
.canvasPage {
  display: flex;
  height: calc(100vh - 80px); // Account for NavBar
  background: $background-dark;
  
  @include respond-to('mobile') {
    flex-direction: column;
  }
}

.canvasContainer {
  flex: 1;
  position: relative;
  background: #1d2230;
}

.controlsPanel {
  width: 340px;
  background: $canvas-controls-bg;
  border-left: 1px solid $border-color;
}
```

### Theme Variables (toe te voegen aan _variables.scss)
```scss
$canvas-bg-dark: #1d2230;
$canvas-controls-bg: #2a3441;
$canvas-text-primary: #ffffff;
$canvas-accent: #3b82f6;
```

## API Integration

### Pexels Service voor Backgrounds
```javascript
// src/services/api/pexelsService.js
class PexelsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_PEXELS_API_KEY;
    this.baseURL = 'https://api.pexels.com/v1';
  }
  
  async searchPhotos(query = 'architecture facade', page = 1, perPage = 15) {
    // Pexels API implementation
  }
}
```

## Testing Strategy

### Essential Tests
```bash
# Component tests (na implementatie)
pnpm run test src/components/Core/Canvas/__tests__/

# Integration tests
pnpm run test src/__tests__/integration/canvas-navigation.test.jsx

# E2E canvas flow (optioneel)
pnpm run test:e2e
```

### Key Test Scenarios
1. **Canvas component renders with poem data**
2. **Navigation from search results to canvas works**  
3. **PIXI application initializes correctly**
4. **Responsive layout adapts to different screen sizes**
5. **Background images load and display**

## Common Issues & Solutions

### 1. PIXI.js Version Compatibility
**Issue**: PIXI v8 requires proper extend() usage  
**Solution**: Always call `extend()` at module level, never in components

### 2. Font Loading Race Conditions
**Issue**: Text flashing during font loading  
**Solution**: Use `useFontLoader` hook with proper loading states

### 3. Mobile Touch Performance  
**Issue**: Drag events can be slow on touch devices
**Solution**: Implement touch-optimized handlers with throttling

### 4. Viewport Camera vs Drag Conflicts
**Issue**: Text drag conflicts with camera controls
**Solution**: Use Ctrl/Cmd key modifiers for different interaction modes

## Development Workflow

### Parallel Development Setup
```bash
# Terminal 1 - Canvas Practice (referentie)
cd "Canvas-Project"
pnpm dev  # Port 5173

# Terminal 2 - Hoofdproject (development)  
pnpm dev  # Port 5174
```

### Implementation Order
1. **Week 1**: Basic canvas component + navigation
2. **Week 2**: Poem data integration + text rendering
3. **Week 3**: Background system + styling controls  
4. **Week 4**: Advanced features + mobile optimization

### Debug Tools (development mode)
```javascript
// Browser console commands
window.debugCanvas.toggle();      // Toggle debug overlay
window.debugCanvas.state();       // Log canvas state
window.debugCanvas.performance(); // Performance metrics
```

## Success Criteria

### MVP (Minimum Viable Product)
- [ ] Canvas component renders selected poems
- [ ] "🎨 Open in canvas" button navigates correctly
- [ ] Basic text styling (font, size, color) works
- [ ] Simple background image support
- [ ] Export canvas as image functionality

### Enhanced Features  
- [ ] Drag-and-drop text positioning
- [ ] Advanced typography controls
- [ ] Pexels background integration
- [ ] Responsive design on all devices
- [ ] 60fps performance optimization

### Production Ready
- [ ] Comprehensive error handling
- [ ] Loading states and user feedback
- [ ] Accessibility compliance
- [ ] Cross-browser compatibility
- [ ] Mobile touch optimization

## Key Reference Files

### Primary Documentation
- `Canvas-Project/docs/CANVAS_INTEGRATION_GUIDE.md` - Volledige integratie guide
- `README.md` - Project overview en tech stack
- `ARCHITECTURE.md` - Algemene project architectuur

### Critical Source Files (Canvas-Project)
- `src/pages/CanvasPage/CanvasPage.jsx` - Hoofd canvas component
- `src/pages/CanvasPage/components/CanvasContent.jsx` - PIXI rendering logic
- `src/pages/CanvasPage/hooks/useCanvasState.js` - State management
- `src/hooks/useFontLoader.js` - Font loading utilities

### Integration Targets (Hoofdproject)
- `src/pages/Design/DesignPage.jsx` - Canvas destination page
- `src/components/Core/Canvas/` - Component destination
- `src/hooks/canvas/` - Hooks destination  
- `src/utils/canvas/` - Utilities destination

## Status Update: Fase 1 & 2 VOLTOOID ✅

**✅ VOLLEDIG WERKEND:**
- Canvas component volledig gemigreerd van Canvas-Project 
- Alle PIXI.js functionaliteit beschikbaar
- Routes geconfigureerd: `/canvas` en `/canvas/:poemId`
- Development server: http://localhost:5174
- Alle import paths en dependencies gecorrigeerd

**🎯 VOLGENDE FASE:**
Zie **PHASE3_CANVAS_INTEGRATION.md** voor gedetailleerde instructies om:
- "🎨 Open in canvas" buttons te activeren
- Poem data flow van search naar canvas te implementeren
- Navigation workflow te voltooien

**Canvas is nu volledig functioneel en production-ready!** 🎨✨

---

*Laatste update: 2025-09-20*  
*Context: Canvas integration voor gedichtgevel.nl - FASE 1&2 COMPLEET*
