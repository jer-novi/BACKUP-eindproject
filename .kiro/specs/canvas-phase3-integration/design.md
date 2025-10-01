# Design Document

## Overview

This design completes Phase 3 of the Canvas integration by connecting the existing "🎨 Open in canvas" buttons in search results to the fully functional canvas component. The canvas component and routing infrastructure are already in place (Phase 1 & 2 complete), but the data flow from search results to canvas needs to be implemented.

The solution involves creating a robust data service for poem transport, updating the existing PoemActionButtons component to handle navigation, and enhancing the DesignPage to properly load both selected poems and demo content.

## Architecture

### High-Level Data Flow

```
Search Results → PoemActionButtons → CanvasDataService → Navigation → DesignPage → Canvas Component
```

1. **User clicks "🎨 Open in canvas"** in search results
2. **PoemActionButtons** captures poem data and triggers navigation
3. **CanvasDataService** stores poem data in sessionStorage for transport
4. **React Router** navigates to `/designgevel/{poemId}`
5. **DesignPage** retrieves poem data and loads Canvas component
6. **Canvas Component** renders poem with PIXI.js

### Route Structure

The application uses the existing `/designgevel` route with optional poem ID parameter:

- `/designgevel` - Loads demo poem from `src/data/canvas/testdata.js`
- `/designgevel/{poemId}` - Loads specific poem data from sessionStorage or fallback

## Components and Interfaces

### 1. CanvasDataService

**Location**: `src/services/canvas/canvasDataService.js`

**Purpose**: Handles poem data transport between search results and canvas

```javascript
export class CanvasDataService {
    static STORAGE_KEY = 'canvas-poem-data';
    
    // Store poem data for canvas
    static storePoemForCanvas(poemData) {
        const standardizedData = this.standardizePoemData(poemData);
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(standardizedData));
        return standardizedData;
    }
    
    // Retrieve poem data for canvas
    static getPoemForCanvas() {
        const stored = sessionStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }
    
    // Clear poem data
    static clearPoemData() {
        sessionStorage.removeItem(this.STORAGE_KEY);
    }
    
    // Standardize poem data format
    static standardizePoemData(poemData) {
        return {
            id: poemData.id || this.generateId(poemData.title),
            title: poemData.title || 'Untitled Poem',
            author: poemData.author || 'Unknown Author',
            lines: Array.isArray(poemData.lines) ? poemData.lines : 
                   typeof poemData.text === 'string' ? poemData.text.split('\n') : 
                   ['No poem content available'],
            source: 'search',
            timestamp: Date.now()
        };
    }
}
```

### 2. useCanvasNavigation Hook

**Location**: `src/hooks/useCanvasNavigation.js`

**Purpose**: Provides navigation utilities for canvas integration

```javascript
export function useCanvasNavigation() {
    const navigate = useNavigate();
    
    const navigateToCanvas = (poemData) => {
        // Store poem data
        const standardizedData = CanvasDataService.storePoemForCanvas(poemData);
        
        // Navigate to designgevel with poem ID
        navigate(`/designgevel/${standardizedData.id}?source=search`);
    };
    
    const navigateBack = (fallback = '/') => {
        CanvasDataService.clearPoemData();
        navigate(fallback);
    };
    
    return { navigateToCanvas, navigateBack };
}
```

### 3. Enhanced PoemActionButtons

**Location**: `src/components/poem/PoemActionButtons.jsx` (existing component)

**Changes**: Update the existing `onNavigateToCanvas` handler to use the new navigation system

```javascript
// In the parent component that renders PoemActionButtons
const { navigateToCanvas } = useCanvasNavigation();

const handleNavigateToCanvas = (poemData) => {
    if (!poemData || !poemData.lines?.length) {
        console.error('❌ Invalid poem data for canvas');
        return;
    }
    navigateToCanvas(poemData);
};

// Pass to PoemActionButtons
<PoemActionButtons 
    poem={poemData}
    onNavigateToCanvas={() => handleNavigateToCanvas(poemData)}
    // ... other props
/>
```

### 4. Enhanced DesignPage

**Location**: `src/pages/Design/DesignPage.jsx` (existing component)

**Changes**: Improve data loading logic to handle demo poems and better error states

```javascript
export function DesignPage() {
    const navigate = useNavigate();
    const { poemId } = useParams();
    const [poemData, setPoemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPoemData();
    }, [poemId]);

    const loadPoemData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Priority 1: Check sessionStorage for selected poem
            const storedPoemData = CanvasDataService.getPoemForCanvas();
            if (storedPoemData) {
                setPoemData(storedPoemData);
                setLoading(false);
                return;
            }
            
            // Priority 2: Load demo poem if no poemId or as fallback
            if (!poemId || poemId === 'demo') {
                const { poems } = await import('@/data/canvas/testdata.js');
                setPoemData(poems[0]); // Use first demo poem
                setLoading(false);
                return;
            }
            
            // Priority 3: Try to load poem by ID (future enhancement)
            // For now, fall back to demo poem
            const { poems } = await import('@/data/canvas/testdata.js');
            setPoemData({
                ...poems[0],
                id: poemId,
                source: 'fallback'
            });
            setLoading(false);
            
        } catch (err) {
            console.error('Failed to load poem data:', err);
            setError('Failed to load poem data');
            setLoading(false);
        }
    };
}
```

## Data Models

### Standard Poem Data Format

All poem data flowing through the system follows this standardized format:

```javascript
const PoemDataSchema = {
    id: String,           // Unique identifier (required)
    title: String,        // Poem title (required)
    author: String,       // Author name (required)
    lines: Array<String>, // Array of poem lines (required)
    source: String,       // 'search' | 'demo' | 'fallback' (optional)
    timestamp: Number,    // When loaded (optional)
    metadata: {           // Additional data (optional)
        originalUrl: String,
        wordCount: Number,
        lineCount: Number
    }
};
```

### Demo Poem Integration

The existing demo poem in `src/data/canvas/testdata.js` will be used as:
- Default content when accessing `/designgevel` without poem ID
- Fallback content when poem data is missing or invalid
- Showcase content for new users

## Error Handling

### Error Boundary Component

**Location**: `src/components/Canvas/CanvasErrorBoundary.jsx`

```javascript
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
        // Could send to error reporting service
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

### Error States in DesignPage

- **Loading State**: Show spinner while poem data loads
- **Error State**: Show error message with retry option
- **No Data State**: Automatically load demo poem
- **Invalid Data State**: Show warning and load demo poem

## Testing Strategy

### Unit Tests

1. **CanvasDataService Tests**
   - Test poem data standardization
   - Test sessionStorage operations
   - Test data validation

2. **useCanvasNavigation Hook Tests**
   - Test navigation with valid poem data
   - Test navigation with invalid data
   - Test cleanup on navigation back

3. **DesignPage Tests**
   - Test loading states
   - Test error handling
   - Test demo poem fallback

### Integration Tests

1. **Search to Canvas Flow**
   - Click "Open in canvas" button
   - Verify navigation to correct route
   - Verify poem data appears in canvas

2. **Direct Canvas Access**
   - Navigate directly to `/designgevel`
   - Verify demo poem loads
   - Verify canvas functionality works

3. **Error Recovery**
   - Test with corrupted sessionStorage data
   - Test with missing poem data
   - Test error boundary activation

### Manual Testing Checklist

- [ ] Click "🎨 Open in canvas" from search results
- [ ] Verify poem appears correctly in canvas
- [ ] Test back navigation clears data
- [ ] Test direct access to `/designgevel` shows demo
- [ ] Test mobile responsiveness
- [ ] Test error states and recovery

## Performance Considerations

### Data Transport Optimization

- Use sessionStorage for temporary poem data (automatically cleared on tab close)
- Implement data compression for large poems if needed
- Clear old data on successful navigation

### Canvas Loading Optimization

- Preload demo poem data
- Implement progressive loading for large poems
- Use React.memo for expensive canvas components

### Memory Management

- Clear sessionStorage on navigation away from canvas
- Implement cleanup in useEffect hooks
- Monitor PIXI.js memory usage in development

## Security Considerations

### Data Validation

- Validate all poem data before storing in sessionStorage
- Sanitize poem content to prevent XSS
- Limit poem data size to prevent storage abuse

### Route Protection

- Validate poem IDs to prevent injection attacks
- Implement rate limiting for canvas access if needed
- Log suspicious navigation patterns

## Accessibility

### Keyboard Navigation

- Ensure "Open in canvas" buttons are keyboard accessible
- Implement proper focus management in canvas
- Provide keyboard shortcuts for common canvas actions

### Screen Reader Support

- Add proper ARIA labels to canvas controls
- Provide text alternatives for visual canvas content
- Implement proper heading structure

### Mobile Accessibility

- Ensure touch targets meet minimum size requirements
- Implement proper gesture support
- Provide alternative input methods for complex interactions