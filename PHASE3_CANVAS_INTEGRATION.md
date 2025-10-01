# Fase 3: Canvas Integration - "Open in Canvas" Functionaliteit

## 📋 Huidige Status

**✅ VOLTOOID (Fase 1 & 2):**
- Canvas component volledig gemigreerd van Canvas-Project
- Alle PIXI.js functionaliteit werkend
- Routes geconfigureerd: `/canvas` en `/canvas/:poemId`
- Development server draait op http://localhost:5174
- Alle import paths en dependencies gecorrigeerd

**🎯 NOG TE DOEN (Fase 3):**
"🎨 Open in canvas" buttons activeren zodat gebruikers vanuit zoekresultaten direct naar canvas gaan met het gekozen gedicht.

## 🎯 Fase 3 Doelstellingen

### Primary Goals
1. **PoemActionButtons activeren**: "🎨 Open in canvas" button werkend maken
2. **Data Flow**: Gedicht data van search naar canvas transporteren
3. **Navigation**: Smooth overgang tussen search results en canvas
4. **User Experience**: Naadloze workflow van zoeken → canvas → terug

### Success Criteria
- [x] Canvas technisch werkend
- [ ] "Open in canvas" button navigeert correct
- [ ] Gedicht data wordt meegegeven aan canvas
- [ ] Canvas toont het juiste gedicht
- [ ] Back navigation werkt
- [ ] Data persistence tussen page navigations

## 🔍 Huidige Project Structuur

### Canvas is nu beschikbaar via:
```
src/components/Core/Canvas/
├── Canvas.jsx                 (Hoofd canvas component)
├── Canvas.module.scss         (Styling)
├── components/               (Alle sub-components)
└── hooks/                   (Canvas hooks in src/hooks/canvas/)
```

### Routes:
```javascript
// In src/main.jsx - REEDS GECONFIGUREERD
{path: 'canvas', element: <DesignPage/>}, 
{path: 'canvas/:poemId', element: <DesignPage/>},
```

### DesignPage:
```javascript
// src/pages/Design/DesignPage.jsx - REEDS GECONFIGUREERD
// Gebruikt Canvas component met props: { poemData, onSave, onBack }
```

## 🎯 Fase 3 Implementation Plan

### Stap 1: PoemActionButtons Component Lokaliseren

**Actie**: Zoek waar de "🎨 Open in canvas" button zit

```bash
# Zoek PoemActionButtons component
grep -r "Open in canvas" src/
grep -r "🎨" src/
grep -r "PoemActionButtons" src/
```

**Verwachte locatie**: 
- `src/components/poem/PoemActionButtons.jsx` OF
- `src/components/search/` folder OF  
- `src/components/ui/` folder

**Wat te zoeken:**
```javascript
// Waarschijnlijk iets zoals dit:
<button 
  onClick={handleNavigateToCanvas}  // <-- DEZE IS NOG NIET WERKEND
  disabled  // <-- WAARSCHIJNLIJK NOG DISABLED
>
  🎨 Open in canvas
</button>
```

### Stap 2: Search Results Components Identificeren

**Actie**: Vind welke componenten de zoekresultaten tonen

```bash
# Zoek search result components
find src/ -name "*Search*" -o -name "*Result*" -o -name "*Poem*"
grep -r "search.*result" src/ --include="*.jsx"
```

**Verwachte componenten**:
- `SearchResults.jsx`
- `PoemResultItem.jsx`  
- `SearchResultCard.jsx`
- Of iets vergelijkbaars

### Stap 3: Data Flow Architecture Implementeren

#### 3.1 Canvas Data Service (REEDS GEMAAKT)
```javascript
// src/services/canvas/canvasDataService.js - MAAK AAN
export class CanvasDataService {
    static STORAGE_KEY = 'canvas-poem-data';
    
    static storePoemForCanvas(poemData) {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(poemData));
        console.log('📝 Stored poem for canvas:', poemData.title);
    }
    
    static getPoemForCanvas() {
        const stored = sessionStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }
    
    static clearPoemData() {
        sessionStorage.removeItem(this.STORAGE_KEY);
    }
}
```

#### 3.2 Navigation Hook (MAAK AAN)
```javascript
// src/hooks/useCanvasNavigation.js
import { useNavigate } from 'react-router';
import { CanvasDataService } from '@/services/canvas/canvasDataService';

export function useCanvasNavigation() {
    const navigate = useNavigate();
    
    const navigateToCanvas = (poemData) => {
        console.log('🎨 Navigating to canvas with poem:', poemData);
        
        // Store poem data
        CanvasDataService.storePoemForCanvas(poemData);
        
        // Navigate to canvas
        navigate(`/canvas/${poemData.id}?source=search`);
    };
    
    const navigateBack = (fallback = '/') => {
        // Clear canvas data
        CanvasDataService.clearPoemData();
        
        // Navigate back
        navigate(fallback);
    };
    
    return { navigateToCanvas, navigateBack };
}
```

### Stap 4: PoemActionButtons Activeren

**Zoek de component** en update als volgt:

```javascript
// In PoemActionButtons.jsx (of waar de button zit)
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';

const PoemActionButtons = ({ poem, ...otherProps }) => {
    const { navigateToCanvas } = useCanvasNavigation();
    
    const handleOpenCanvas = () => {
        if (!poem) {
            console.error('❌ No poem data available for canvas');
            return;
        }
        
        // Transform poem data to canvas format
        const canvasData = {
            id: poem.id || poem.title?.replace(/\s+/g, '-').toLowerCase(),
            title: poem.title,
            author: poem.author,
            lines: poem.lines || poem.text?.split('\n') || [],
            source: 'search',
            timestamp: Date.now()
        };
        
        navigateToCanvas(canvasData);
    };
    
    return (
        // ... andere buttons
        <button
            onClick={handleOpenCanvas}
            disabled={!poem || !poem.lines?.length}
            className="canvas-button"
            aria-label="Open dit gedicht in de canvas editor"
        >
            🎨 Open in canvas
        </button>
    );
};
```

### Stap 5: Parent Components Updaten

**Waar PoemActionButtons wordt gebruikt**, zorg ervoor dat `poem` data wordt doorgegeven:

```javascript
// In SearchResults.jsx of PoemResultItem.jsx
const SearchResultItem = ({ poemData }) => {
    return (
        <div className="poem-result">
            <h3>{poemData.title}</h3>
            <p>{poemData.author}</p>
            
            {/* ZORG ERVOOR DAT poemData wordt doorgegeven */}
            <PoemActionButtons 
                poem={poemData}  // <-- DIT IS CRUCIAAL
                // ... andere props
            />
        </div>
    );
};
```

### Stap 6: Canvas Data Integration Verbeteren

#### 6.1 DesignPage.jsx Enhancement
```javascript
// src/pages/Design/DesignPage.jsx - UPDATE DEZE
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Canvas from '@/components/Core/Canvas/Canvas.jsx';
import { CanvasDataService } from '@/services/canvas/canvasDataService';

export function DesignPage() {
    const navigate = useNavigate();
    const { poemId } = useParams();
    const [poemData, setPoemData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // PRIORITY 1: Check sessionStorage first
        const storedPoemData = CanvasDataService.getPoemForCanvas();
        if (storedPoemData) {
            console.log('📖 Loading poem from storage:', storedPoemData.title);
            setPoemData(storedPoemData);
            setLoading(false);
            return;
        }
        
        // PRIORITY 2: If no stored data but we have poemId, create fallback
        if (poemId) {
            console.log('⚠️ No stored data, creating fallback for poemId:', poemId);
            setPoemData({
                id: poemId,
                title: "Sample Poem",
                author: "Unknown Author", 
                lines: [
                    "This is a sample poem line",
                    "To demonstrate the canvas functionality",
                    "Use the search to open real poems here"
                ],
                source: 'fallback'
            });
            setLoading(false);
            return;
        }
        
        // PRIORITY 3: No data at all - redirect to home
        console.log('❌ No poem data available, redirecting...');
        navigate('/');
    }, [poemId, navigate]);

    const handleCanvasSave = (imageData) => {
        console.log('💾 Canvas save requested:', imageData);
        // TODO: Implement actual save functionality
    };

    const handleCanvasBack = () => {
        console.log('⬅️ Navigating back from canvas');
        CanvasDataService.clearPoemData();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="canvas-loading">
                <h2>Loading poem for canvas...</h2>
            </div>
        );
    }

    if (!poemData) {
        return (
            <div className="canvas-error">
                <h2>No poem data available</h2>
                <button onClick={() => navigate('/')}>Back to Search</button>
            </div>
        );
    }

    return (
        <Canvas 
            poemData={poemData}
            onSave={handleCanvasSave}
            onBack={handleCanvasBack}
        />
    );
}
```

### Stap 7: Poem Data Format Standaardiseren

**KRITIEK**: Zorg ervoor dat alle poem data dit format heeft:

```javascript
// Standard poem data format for canvas
const standardPoemFormat = {
    id: "unique-identifier",           // Required
    title: "Poem Title",               // Required  
    author: "Author Name",             // Required
    lines: ["Line 1", "Line 2", ...], // Required - array of strings
    source: "search|api|fallback",     // Optional - tracking
    timestamp: 1234567890,             // Optional - when loaded
    metadata: {                        // Optional - extra info
        originalUrl: "...",
        wordCount: 123,
        lineCount: 10
    }
};
```

### Stap 8: Error Handling & User Feedback

```javascript
// src/components/Canvas/CanvasErrorBoundary.jsx - MAAK AAN
import React from 'react';

class CanvasErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('🚨 Canvas Error:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="canvas-error-boundary">
                    <h2>Canvas Error</h2>
                    <p>Sorry, the canvas failed to load.</p>
                    <button onClick={() => window.location.href = '/'}>
                        Back to Home
                    </button>
                </div>
            );
        }
        
        return this.props.children;
    }
}
```

## 🧪 Testing Plan

### Manual Testing Checklist

#### Pre-requisites
- [ ] Development server running on http://localhost:5174
- [ ] No console errors on canvas page
- [ ] Canvas loads with fallback data on `/canvas/test`

#### Test Scenario 1: Direct Canvas Access
```
1. Navigate to http://localhost:5174/canvas/123
2. ✅ Canvas should load with fallback poem
3. ✅ PIXI.js text rendering should work
4. ✅ Controls should be responsive
5. ✅ Back button should work
```

#### Test Scenario 2: Search to Canvas Flow  
```
1. Navigate to home page
2. Search for a poem
3. Click "🎨 Open in canvas" on a result
4. ✅ Should navigate to /canvas/[poemId]
5. ✅ Canvas should load with selected poem
6. ✅ Poem text should render correctly  
7. ✅ Back button should return to search
```

#### Test Scenario 3: Data Persistence
```
1. Open poem in canvas
2. Make changes (move text, change colors)
3. Navigate away and back
4. ✅ Should maintain some state (if implemented)
```

### Debug Commands
```javascript
// In browser console for debugging
console.log('Canvas data:', sessionStorage.getItem('canvas-poem-data'));
console.log('Current path:', window.location.pathname);

// Clear canvas data manually
sessionStorage.removeItem('canvas-poem-data');
```

## 🔧 Troubleshooting Guide

### Issue: "Open in Canvas" button not found
**Solution**: Search in these locations:
```bash
find src/ -type f -name "*.jsx" -exec grep -l "canvas\|Canvas" {} \;
grep -r "🎨\|Open.*canvas" src/
```

### Issue: Poem data not reaching canvas
**Debug steps**:
1. Check if sessionStorage is being set: `sessionStorage.getItem('canvas-poem-data')`
2. Verify navigation is happening: Check URL changes
3. Check DesignPage.jsx for data loading logic
4. Console.log the data flow at each step

### Issue: Canvas component crashes
**Common causes**:
- Missing or malformed poem data
- PIXI.js initialization issues  
- Import path problems

**Solutions**:
1. Wrap Canvas in ErrorBoundary
2. Add data validation before rendering
3. Check browser developer tools for exact error

### Issue: Navigation doesn't work
**Check**:
1. Are routes properly configured in main.jsx?
2. Is useNavigate() imported correctly?
3. Is React Router v7 syntax used consistently?

## 📁 File Checklist

**Files to Create/Update**:
- [ ] `src/services/canvas/canvasDataService.js` 
- [ ] `src/hooks/useCanvasNavigation.js`
- [ ] Find and update `PoemActionButtons.jsx`
- [ ] Update `DesignPage.jsx` (reeds gedaan, maar kan verbeterd worden)
- [ ] `src/components/Canvas/CanvasErrorBoundary.jsx`

**Files to Locate**:
- [ ] Search results component(s)
- [ ] Poem data structure/format
- [ ] Existing poetry API services

## 🎯 Success Metrics

**Phase 3 is complete when**:
- [x] Canvas technically works (DONE)
- [ ] Users can click "Open in canvas" from search results
- [ ] Selected poem appears correctly in canvas
- [ ] All PIXI.js functionality works with real poem data
- [ ] Navigation back to search works seamlessly
- [ ] No console errors in typical user flow
- [ ] Mobile responsiveness maintained

## 🚀 Next Phase Ideas (Future Enhancement)

**Phase 4 could include**:
- Save canvas creations to user account
- Share canvas creations  
- Advanced typography options
- Background image from poem themes
- Export in multiple formats
- Canvas templates/presets

---

**Last Updated**: 2025-09-20  
**Canvas Integration**: Phase 1 & 2 COMPLETE ✅  
**Next**: Phase 3 Implementation by new agent 🎯
