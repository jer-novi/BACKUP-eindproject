// src/pages/CanvasPage/hooks/useCanvasState.js

import {useState, useEffect, useRef, useMemo} from "react";
import {useSelection} from "./useSelection"; // Selection state management hook
import {useFontManager} from "./useFontManager"; // Font loading and management hook
import {usePexels} from "./usePexels"; // Pexels image API integration
import {useFlickr} from "./useFlickr"; // Flickr image API integration

export function useCanvasState() {
    // References to DOM elements for viewport and content
    const viewportRef = useRef(null);
    const contentRef = useRef(null);

    // State for drag-and-drop offset and movement mode
    const [poemOffset, setPoemOffset] = useState({x: 170, y: 0});
    const [moveMode, setMoveMode] = useState("edit"); // Possible values: 'edit', 'poem', 'line'

    // UI state for various canvas controls and overlays
    const [viewportDragEnabled, setViewportDragEnabled] = useState(false);
    const [lineOverrides, setLineOverrides] = useState({});
    const [isColorPickerActive, setIsColorPickerActive] = useState(false);
    const [photoGridVisible, setPhotoGridVisible] = useState(false); // Controls visibility of the floating photo grid
    const [isDragging, setIsDragging] = useState(false); // Synchronizes XYMoveSliders with drag state
    const [xySlidersVisible, setXySlidersVisible] = useState(true);

    // Selection state for lines and elements
    const selection = useSelection();
    // Font management state and handlers
    const {fontStatus, loadFont, availableFonts} = useFontManager();

    // Font family state for current and pending font
    const [currentFontFamily, setCurrentFontFamily] = useState("Lato");
    const [pendingFontFamily, setPendingFontFamily] = useState(null);

    // State for the selected background image (URL)
    const [backgroundImage, setBackgroundImage] = useState(null);

    // Initialize image API hooks after state declarations
    const pexels = usePexels(setBackgroundImage); // Handles Pexels image search and default background
    const flickr = useFlickr(); // Handles Flickr image search

    // State for tracking the current search context in the photo modal
    const [searchContext, setSearchContext] = useState({
        type: 'collection', // Possible values: 'collection', 'pexels_search', 'flickr_city', 'pexels_fallback'
        query: '',
        source: 'pexels' // Possible values: 'pexels', 'flickr'
    });

    // Effect to update the current font family when a pending font is loaded
    useEffect(() => {
        if (pendingFontFamily && fontStatus[pendingFontFamily] === "loaded") {
            setCurrentFontFamily(pendingFontFamily);
            setPendingFontFamily(null);
        }
    }, [
        pendingFontFamily,
        fontStatus,
        setCurrentFontFamily,
        setPendingFontFamily,
    ]);

    // Text styling state for font size, color, spacing, and alignment
    const [fontSize, setFontSize] = useState(20);
    const [fillColor, setFillColor] = useState("#000000");
    const [letterSpacing, setLetterSpacing] = useState(0);

    // Hierarchical color override state for title and author
    const [titleColorOverride, setTitleColorOverride] = useState(null);
    const [authorColorOverride, setAuthorColorOverride] = useState(null);

    // Deprecated color state for backward compatibility
    const [titleColor, setTitleColor] = useState("#000000");
    const [authorColor, setAuthorColor] = useState("#000000");

    // Line height and alignment state
    const [lineHeight, setLineHeight] = useState(24 * 1.4);
    const [lineHeightMultiplier, setLineHeightMultiplier] = useState(1.4);
    const [textAlign, setTextAlign] = useState("center");

    // Font style state for weight and style
    const [fontWeight, setFontWeight] = useState("normal");
    const [fontStyle, setFontStyle] = useState("normal");

    // Skew transformation state for X and Y axes
    const [skewX, setSkewX] = useState(0);
    const [skewY, setSkewY] = useState(0);

    // Tracks if the user has manually adjusted the canvas
    const [userHasAdjusted, setUserHasAdjusted] = useState(false);

    // Memoized computed values for effective colors and override checks
    const effectiveTitleColor = useMemo(() => {
        return titleColorOverride || fillColor;
    }, [titleColorOverride, fillColor]);

    const effectiveAuthorColor = useMemo(() => {
        return authorColorOverride || fillColor;
    }, [authorColorOverride, fillColor]);

    const hasTitleColorOverride = useMemo(() => {
        return titleColorOverride !== null;
    }, [titleColorOverride]);

    const hasAuthorColorOverride = useMemo(() => {
        return authorColorOverride !== null;
    }, [authorColorOverride]);

    // Expose all state and handlers for use in canvas components
    return {
        // DOM references
        viewportRef,
        contentRef,

        // Selection state and handlers
        ...selection,
        clearSelection: selection.clearSelection,

        // UI state
        viewportDragEnabled,
        setViewportDragEnabled,
        lineOverrides,
        setLineOverrides,
        isColorPickerActive,
        setIsColorPickerActive,
        photoGridVisible,
        setPhotoGridVisible,
        isDragging,
        setIsDragging,
        xySlidersVisible,
        setXySlidersVisible,

        // Font management
        currentFontFamily,
        setCurrentFontFamily,
        pendingFontFamily,
        setPendingFontFamily,
        fontStatus,
        loadFont,
        availableFonts,
        fontFamily: currentFontFamily,

        // Pexels image API state and handlers
        ...pexels,

        // Flickr image API state and handlers
        ...flickr,

        // Background image state
        backgroundImage,
        setBackgroundImage,

        // Photo search context state
        searchContext,
        setSearchContext,

        // Text styling state
        fontSize,
        setFontSize,
        fillColor,
        setFillColor,
        letterSpacing,
        setLetterSpacing,

        // Hierarchical color override state
        titleColorOverride,
        setTitleColorOverride,
        authorColorOverride,
        setAuthorColorOverride,

        // Computed effective colors and override checks
        effectiveTitleColor,
        effectiveAuthorColor,
        hasTitleColorOverride,
        hasAuthorColorOverride,

        // Deprecated color state for backward compatibility
        titleColor,
        setTitleColor,
        authorColor,
        setAuthorColor,

        // Line height and alignment state
        lineHeight,
        setLineHeight,
        lineHeightMultiplier,
        setLineHeightMultiplier,
        textAlign,
        setTextAlign,

        // Font style state
        fontWeight,
        setFontWeight,
        fontStyle,
        setFontStyle,

        // Skew transformation state
        skewX,
        setSkewX,
        skewY,
        setSkewY,

        // Drag-and-drop offset and movement mode
        poemOffset,
        setPoemOffset,
        moveMode,
        setMoveMode,

        // User adjustment tracking
        userHasAdjusted,
        setUserHasAdjusted,
    };
}
