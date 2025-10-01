import {Application, extend} from "@pixi/react";
import {Text, Container, Graphics, Sprite} from "pixi.js";
import {Viewport} from "pixi-viewport";
import {useEffect, useState, useCallback} from "react";
import {useNavigate} from "react-router";

// CRITICAL: extend() MUST be called at module level, outside components
extend({Text, Container, Graphics, Sprite, Viewport});

import Controls from "./components/Controls";
import {useResponsiveCanvas} from "../../../hooks/canvas/useResponsiveCanvas";
import {useCanvasState} from "../../../hooks/canvas/useCanvasState";
import {useCanvasHandlers} from "../../../hooks/canvas/useCanvasHandlers";
import {useKeyboardShortcuts} from "../../../hooks/canvas/useKeyboardShortcuts";
import {CanvasContent} from "./components/CanvasContent";
import ResponsiveLayout from "./components/ResponsiveLayout";
import Navigation from "./components/Navigation";
import FloatingPhotoGrid from "./components/FloatingPhotoGrid";
import XYMoveSliders from "./components/XYMoveSliders";
import ShortcutFeedback from "./components/ShortcutFeedback";
import styles from "./Canvas.module.scss";
import {debugManager} from "../../../debug/DebugManager.js";
import {useResponsiveTextPosition} from "../../../hooks/canvas/useResponsiveTextPosition";
import {clearAllPersistedState} from "../../../hooks/canvas/usePersistedState";

// Main component that manages state
export default function Canvas({
                                   poemData,
                                   backgroundUrl,
                                   onSave,
                                   onBack,
                                   onToggleNavbarOverlay,
                                   savedCanvasState,
                                   currentDesignId
                               }) {
    const navigate = useNavigate();

    // Use provided poem data or fallback
    const currentPoem = poemData || {
        title: "Geen gedicht geselecteerd",
        author: "Onbekende auteur",
        lines: ["Selecteer een gedicht om te visualiseren"]
    };

    // Use custom hooks for state and handlers
    const canvasState = useCanvasState();
    const handlers = useCanvasHandlers(canvasState, currentPoem);

    // Restore canvas state from loaded design (destructive override)
    useEffect(() => {
        if (savedCanvasState) {
            console.log("🔄 Canvas: DESTRUCTIVE restore of saved canvas state");

            // CRITICAL: Clear ALL persisted state first to ensure clean slate
            clearAllPersistedState();

            // Small delay to ensure localStorage is cleared before state updates
            setTimeout(() => {
                // Restore all serialized state properties
                if (savedCanvasState.backgroundImage !== undefined) {
                    console.log("🖼️ Canvas: Setting saved background:", savedCanvasState.backgroundImage);
                    canvasState.setBackgroundImage(savedCanvasState.backgroundImage);
                }
                if (savedCanvasState.poemOffset) canvasState.setPoemOffset(savedCanvasState.poemOffset);
                if (savedCanvasState.fontSize) canvasState.setFontSize(savedCanvasState.fontSize);
                if (savedCanvasState.fillColor) canvasState.setFillColor(savedCanvasState.fillColor);
                if (savedCanvasState.letterSpacing !== undefined) canvasState.setLetterSpacing(savedCanvasState.letterSpacing);
                if (savedCanvasState.lineHeight) canvasState.setLineHeight(savedCanvasState.lineHeight);
                if (savedCanvasState.lineHeightMultiplier) canvasState.setLineHeightMultiplier(savedCanvasState.lineHeightMultiplier);
                if (savedCanvasState.textAlign) canvasState.setTextAlign(savedCanvasState.textAlign);
                if (savedCanvasState.fontWeight) canvasState.setFontWeight(savedCanvasState.fontWeight);
                if (savedCanvasState.fontStyle) canvasState.setFontStyle(savedCanvasState.fontStyle);
                if (savedCanvasState.currentFontFamily) canvasState.setCurrentFontFamily(savedCanvasState.currentFontFamily);
                if (savedCanvasState.lineOverrides) canvasState.setLineOverrides(savedCanvasState.lineOverrides);
                if (savedCanvasState.titleColorOverride !== undefined) canvasState.setTitleColorOverride(savedCanvasState.titleColorOverride);
                if (savedCanvasState.authorColorOverride !== undefined) canvasState.setAuthorColorOverride(savedCanvasState.authorColorOverride);
                if (savedCanvasState.skewX !== undefined) canvasState.setSkewX(savedCanvasState.skewX);
                if (savedCanvasState.skewY !== undefined) canvasState.setSkewY(savedCanvasState.skewY);
                if (savedCanvasState.skewZ !== undefined) canvasState.setSkewZ(savedCanvasState.skewZ);
                if (savedCanvasState.lineTransforms) canvasState.setLineTransforms(savedCanvasState.lineTransforms);
                if (savedCanvasState.global3DSettings) canvasState.setGlobal3DSettings(savedCanvasState.global3DSettings);
                if (savedCanvasState.isOptimizationEnabled !== undefined) canvasState.setIsOptimizationEnabled(savedCanvasState.isOptimizationEnabled);
                if (savedCanvasState.moveMode) canvasState.setMoveMode(savedCanvasState.moveMode);

                console.log("✅ Canvas: State restored successfully");
            }, 50); // Small delay to ensure localStorage is cleared
        }
    }, [savedCanvasState]); // Only run when savedCanvasState changes

    // Photo preview state management
    const [previewState, setPreviewState] = useState('normal'); // 'normal' | 'dimmed' | 'preview'
    const [previewImage, setPreviewImage] = useState(null);

    // State voor XY focus callback
    const [onXyFocusRequest, setOnXyFocusRequest] = useState(null);

    // Thumbnail hover freeze state voor 2 seconden na Alt+J
    const [hoverFreezeActive, setHoverFreezeActive] = useState(false);

    // Background loading freeze state - blocks hover during image loading
    const [backgroundLoadingFreeze, setBackgroundLoadingFreeze] = useState(false);

    // Active shortcut visualization state
    const [activeShortcut, setActiveShortcut] = useState(null);

    // Set initial background if provided
    useEffect(() => {
        if (backgroundUrl && !canvasState.backgroundImage) {
            canvasState.setBackgroundImage(backgroundUrl);
        }
    }, [backgroundUrl, canvasState]);

    // Timer voor hover freeze
    useEffect(() => {
        if (hoverFreezeActive) {
            console.log('🖱️ Alt+J: Thumbnail hover freeze activated for 2 seconds');
            const timer = setTimeout(() => {
                setHoverFreezeActive(false);
                console.log('🖱️ Alt+J: Thumbnail hover freeze deactivated');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [hoverFreezeActive]);

    // Handle preview state changes from FloatingPhotoGrid
    const handlePreviewChange = useCallback(({previewMode, previewImage, hasHovered}) => {
        console.log('🖼️ Canvas preview change:', {previewMode, previewImage, hasHovered});

        // Determine the correct preview state based on hasHovered
        let finalPreviewState = previewMode;
        if (previewMode === 'dimmed' && hasHovered) {
            // If grid is open but user has hovered, show preview (not dimmed)
            finalPreviewState = 'preview';
        }

        setPreviewState(finalPreviewState);
        setPreviewImage(previewImage);
    }, []);

    // Handle navigation back
    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    }, [onBack, navigate]);

    // Handle save functionality
    const handleSave = useCallback(async () => {
        if (onSave) {
            try {
                // Export canvas as image and call provided save handler
                const canvas = canvasState.viewportRef.current?.app.renderer.canvas;
                if (canvas) {
                    const dataURL = canvas.toDataURL('image/png');
                    await onSave(dataURL, currentPoem);
                }
            } catch (error) {
                console.error('Canvas save failed:', error);
            }
        }
    }, [onSave, canvasState.viewportRef, currentPoem]);

    // Use keyboard shortcuts hook for mode cycling and selection management
    const keyboardShortcuts = useKeyboardShortcuts({
        moveMode: canvasState.moveMode,
        setMoveMode: canvasState.setMoveMode,
        selectedLines: canvasState.selectedLines,
        clearSelection: canvasState.clearSelection,
        selectAll: canvasState.selectAll,
        selectAllIncludingTitleAuthor: canvasState.selectAllIncludingTitleAuthor,
        currentPoem,
        xySlidersVisible: canvasState.xySlidersVisible,
        setXySlidersVisible: canvasState.setXySlidersVisible,
        highlightVisible: canvasState.highlightVisible,
        setHighlightVisible: canvasState.setHighlightVisible,
        setHoverFreezeActive,
        setActiveShortcut,
    });

    // Use responsive canvas hook
    const layout = useResponsiveCanvas();

    // 3D transformation handlers
    const getSelectedTransformValues = useCallback((property, defaultValue) => {
        if (canvasState.selectedLines.size === 0) {
            return [];
        }

        const values = [];
        canvasState.selectedLines.forEach(lineIndex => {
            const transform = canvasState.lineTransforms[lineIndex];
            let value = defaultValue;

            if (transform) {
                // Handle nested properties (e.g., "lighting.enabled")
                if (property.includes(".")) {
                    const [parentProp, childProp] = property.split(".");
                    if (
                        transform[parentProp] &&
                        transform[parentProp][childProp] !== undefined
                    ) {
                        value = transform[parentProp][childProp];
                    }
                } else if (transform[property] !== undefined) {
                    value = transform[property];
                }
            }

            values.push(value);
        });
        return values;
    }, [canvasState.lineTransforms, canvasState.selectedLines]);

    const handleSelectedTransformChange = useCallback((property, value, isRelative = false) => {
        canvasState.selectedLines.forEach(lineIndex => {
            const currentTransform = canvasState.lineTransforms[lineIndex] || {};
            const currentValue = currentTransform[property] || 0;
            const newValue = isRelative ? currentValue + value : value;
            handlers.handleLineTransformChange(lineIndex, property, newValue);
        });
    }, [canvasState.lineTransforms, canvasState.selectedLines, handlers]);

    // Bepaal welke data we aan de fotogalerij moeten tonen.
    // We checken de search context om te bepalen welke bron actief is.
    const isFlickrActive = canvasState.searchContext?.source === 'flickr' &&
        (canvasState.isFlickrLoading || (canvasState.flickrPhotos && canvasState.flickrPhotos.length > 0));
    const photosToShow = isFlickrActive ? canvasState.flickrPhotos : canvasState.photos;
    const isLoading = canvasState.isFlickrLoading || canvasState.isLoading;
    const error = canvasState.flickrError || canvasState.error;
    const hasNextPage = isFlickrActive ? canvasState.hasNextFlickrPage : canvasState.hasNextPage;
    const hasPrevPage = isFlickrActive ? canvasState.hasPrevFlickrPage : canvasState.hasPrevPage;

    // Photo grid data ready for rendering

    const textPosition = useResponsiveTextPosition(
        layout.canvasWidth,
        layout.canvasHeight,
        canvasState.fontSize,
        canvasState.lineHeight,
        currentPoem?.lines ?? []
    );

    const handleResetViewport = useCallback(() => {
        const viewport = canvasState.viewportRef.current;
        if (viewport) {
            viewport.animate({
                position: {x: layout.canvasWidth / 2, y: layout.canvasHeight / 2},
                scale: 1,
                time: 800,
                ease: 'easeInOutCubic',
            });
        }
    }, [canvasState.viewportRef, layout.canvasWidth, layout.canvasHeight]);

    useEffect(() => {
        debugManager.registerResetHandler(handleResetViewport);
        // Cleanup on unmount
        return () => debugManager.registerResetHandler(null);
    }, [handleResetViewport]);

    // Handle selection restoration when switching modes
    useEffect(() => {
        // When switching to line mode from edit mode with no current selection,
        // restore the previous selection if it exists
        if (canvasState.moveMode === 'line' && canvasState.selectedLines.size === 0) {
            const previousSelection = keyboardShortcuts.restorePreviousSelection();
            if (previousSelection.size > 0) {
                canvasState.restoreSelection(previousSelection);
            }
        }
    }, [canvasState.moveMode, canvasState.selectedLines.size, keyboardShortcuts, canvasState.restoreSelection]);

    return (
        <>
            <ResponsiveLayout
                layout={layout}
                previewState={previewState}
                controls={
                    <Controls
                        onResetViewport={handleResetViewport}
                        fontSize={canvasState.fontSize}
                        onFontSizeChange={handlers.handleFontSizeChange}
                        fillColor={canvasState.fillColor}
                        onFillColorChange={canvasState.setFillColor}
                        letterSpacing={canvasState.letterSpacing}
                        onLetterSpacingChange={canvasState.setLetterSpacing}
                        lineHeight={canvasState.lineHeight}
                        onLineHeightChange={handlers.handleLineHeightChange}
                        lineHeightMultiplier={canvasState.lineHeightMultiplier}
                        onLineHeightMultiplierChange={
                            handlers.handleLineHeightMultiplierChange
                        }
                        onResetLineHeight={handlers.handleResetLineHeight}
                        textAlign={canvasState.textAlign}
                        onTextAlignChange={canvasState.setTextAlign}
                        selectedLines={canvasState.selectedLines}
                        onLineColorChange={handlers.handleLineColorChange}
                        onLineLetterSpacingChange={handlers.handleLineLetterSpacingChange}
                        onLineFontSizeChange={handlers.handleLineFontSizeChange}
                        handleResetSelectedLines={handlers.handleResetSelectedLines}
                        onApplyGlobalLetterSpacing={
                            handlers.handleApplyGlobalLetterSpacing
                        }
                        lineOverrides={canvasState.lineOverrides}
                        viewportDragEnabled={canvasState.viewportDragEnabled}
                        onViewportToggle={handlers.handleViewportToggle}
                        onColorPickerActiveChange={handlers.handleColorPickerActiveChange}
                        // Hierarchical color system props
                        effectiveTitleColor={canvasState.effectiveTitleColor}
                        effectiveAuthorColor={canvasState.effectiveAuthorColor}
                        hasTitleColorOverride={canvasState.hasTitleColorOverride}
                        hasAuthorColorOverride={canvasState.hasAuthorColorOverride}
                        onTitleColorChange={handlers.handleTitleColorChange}
                        onAuthorColorChange={handlers.handleAuthorColorChange}
                        onResetTitleColor={handlers.handleResetTitleColor}
                        onResetAuthorColor={handlers.handleResetAuthorColor}
                        // Deprecated: keeping for backward compatibility
                        titleColor={canvasState.titleColor}
                        authorColor={canvasState.authorColor}
                        availableFonts={canvasState.availableFonts}
                        fontFamily={canvasState.fontFamily}
                        onFontFamilyChange={handlers.handleFontFamilyChange}
                        // Font style props
                        fontWeight={canvasState.fontWeight}
                        onFontWeightChange={handlers.handleFontWeightChange}
                        fontStyle={canvasState.fontStyle}
                        onFontStyleChange={handlers.handleFontStyleChange}
                        // Skew props
                        skewX={canvasState.skewX}
                        onSkewXChange={handlers.handleSkewXChange}
                        skewY={canvasState.skewY}
                        onSkewYChange={handlers.handleSkewYChange}
                        skewZ={canvasState.skewZ}
                        onSkewZChange={handlers.handleSkewZChange}
                        // Pexels background props
                        photos={canvasState.photos}
                        isLoading={canvasState.isLoading}
                        error={canvasState.error}
                        onSearch={handlers.handleSearchBackground} // De bestaande voor vrij zoeken
                        onCitySearch={handlers.handleCitySearch}
                        onPremiumSearch={handlers.handlePremiumSearch} // NEW: Premium Flickr text search
                        onSetBackground={handlers.handleSetBackground}
                        onNextPage={handlers.handleNextPage}
                        onPrevPage={handlers.handlePrevPage}
                        hasNextPage={canvasState.hasNextPage}
                        hasPrevPage={canvasState.hasPrevPage}
                        onResetToCollection={handlers.handleResetToCollection}
                        onOpenPhotoGrid={handlers.handleOpenPhotoGrid}
                        poemOffset={canvasState.poemOffset}
                        setPoemOffset={canvasState.setPoemOffset}
                        hoverFreezeActive={hoverFreezeActive} // Pass hover freeze state for timer
                        isOptimizationEnabled={canvasState.isOptimizationEnabled}
                        setIsOptimizationEnabled={canvasState.setIsOptimizationEnabled}
                        // 3D transformation props
                        lineTransforms={canvasState.lineTransforms}
                        global3DSettings={canvasState.global3DSettings}
                        onLineTransformChange={handlers.handleLineTransformChange}
                        onGlobal3DSettingChange={handlers.handleGlobal3DSettingChange}
                        onResetLineTransform={handlers.handleResetLineTransform}
                        onResetAllTransforms={handlers.handleResetAllTransforms}
                        getSelectedTransformValues={getSelectedTransformValues}
                        handleSelectedTransformChange={handleSelectedTransformChange}
                        // Canvas-specific props
                        onSave={handleSave}
                        onBack={handleBack}
                    />
                }
                canvas={
                    <Application
                        width={layout.canvasWidth}
                        height={layout.canvasHeight}
                        options={{
                            background: 0x1d2230,
                            resolution: window.devicePixelRatio || 1,
                            autoDensity: true,
                        }}
                    >
                        <CanvasContent
                            poemData={currentPoem}
                            canvasWidth={layout.canvasWidth}
                            canvasHeight={layout.canvasHeight}
                            fontSize={canvasState.fontSize}
                            fillColor={canvasState.fillColor}
                            letterSpacing={canvasState.letterSpacing}
                            lineHeight={canvasState.lineHeight}
                            textAlign={canvasState.textAlign}
                            titleColor={canvasState.effectiveTitleColor}
                            authorColor={canvasState.effectiveAuthorColor}
                            viewportRef={canvasState.viewportRef}
                            contentRef={canvasState.contentRef}
                            fontFamily={canvasState.fontFamily}
                            fontStatus={canvasState.fontStatus}
                            fontWeight={canvasState.fontWeight}
                            fontStyle={canvasState.fontStyle}
                            skewX={canvasState.skewX}
                            skewY={canvasState.skewY}
                            skewZ={canvasState.skewZ}
                            onFontFamilyChange={handlers.handleFontFamilyChange}
                            selectedLines={canvasState.selectedLines}
                            lineOverrides={canvasState.lineOverrides}
                            setLineOverrides={canvasState.setLineOverrides}
                            onLineSelect={handlers.handleLineSelect}
                            viewportDragEnabled={canvasState.viewportDragEnabled}
                            isColorPickerActive={canvasState.isColorPickerActive}
                            backgroundImage={previewImage || canvasState.backgroundImage}
                            onNextPage={handlers.handleNextPage}
                            onPrevPage={handlers.handlePrevPage}
                            hasNextPage={canvasState.hasNextPage}
                            hasPrevPage={canvasState.hasPrevPage}
                            onSearch={handlers.handleSearchBackground} // De bestaande voor vrij zoeken
                            onCitySearch={handlers.handleCitySearch} // De nieuwe voor de dropdowns
                            onPremiumSearch={handlers.handlePremiumSearch} // NEW: Premium Flickr text search
                            poemOffset={canvasState.poemOffset}
                            setPoemOffset={canvasState.setPoemOffset}
                            moveMode={canvasState.moveMode}
                            isDragging={canvasState.isDragging}
                            setIsDragging={canvasState.setIsDragging}
                            effectiveStyles={canvasState.effectiveStyles}
                            highlightVisible={canvasState.highlightVisible}
                            // 3D transformation props
                            lineTransforms={canvasState.lineTransforms}
                            global3DSettings={canvasState.global3DSettings}
                            // Pass current poem data
                            currentPoem={currentPoem}
                        />
                    </Application>
                }
                navigation={
                    <Navigation
                        onSyncAllColorsToGlobal={handlers.handleSyncAllColorsToGlobal}
                        onSyncAllFontsToGlobal={handlers.handleSyncAllFontsToGlobal}
                        moveMode={canvasState.moveMode}
                        setMoveMode={canvasState.setMoveMode}
                        selectedLines={canvasState.selectedLines}
                        clearSelection={canvasState.clearSelection}
                        activeShortcut={activeShortcut}
                        xySlidersVisible={canvasState.xySlidersVisible}
                        setXySlidersVisible={canvasState.setXySlidersVisible}
                        highlightVisible={canvasState.highlightVisible}
                        setHighlightVisible={canvasState.setHighlightVisible}
                        onToggleNavbarOverlay={onToggleNavbarOverlay}
                        poemData={currentPoem}
                        canvasState={canvasState}
                        currentDesignId={currentDesignId}
                    />
                }
            />

            {/* Canvas Shortcut Feedback */}
            <ShortcutFeedback activeShortcut={activeShortcut}/>

            {/* Floating Photo Grid */}
            {canvasState.photoGridVisible && (
                <FloatingPhotoGrid
                    photos={photosToShow}
                    isLoading={isLoading}
                    error={error}
                    searchContext={canvasState.searchContext}
                    onSetBackground={handlers.handleSetBackground}
                    onSetBackgroundLoadingFreeze={setBackgroundLoadingFreeze}
                    onClose={() => canvasState.setPhotoGridVisible(false)}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                    onNextPage={handlers.handleNextPage}
                    onPrevPage={handlers.handlePrevPage}
                    currentBackground={canvasState.backgroundImage}
                    onPreviewChange={handlePreviewChange}
                    hoverFreezeActive={hoverFreezeActive || backgroundLoadingFreeze} // Combined freeze state
                />
            )}

            {/* Floating XY Move Sliders - Only show in poem/line modes */}
            {(canvasState.moveMode === "poem" || canvasState.moveMode === "line") &&
                canvasState.xySlidersVisible && (
                    <XYMoveSliders
                        moveMode={canvasState.moveMode}
                        selectedLines={canvasState.selectedLines}
                        poemOffset={canvasState.poemOffset}
                        setPoemOffset={canvasState.setPoemOffset}
                        lineOverrides={canvasState.lineOverrides}
                        setLineOverrides={canvasState.setLineOverrides}
                        isDragging={canvasState.isDragging}
                        canvasWidth={layout.canvasWidth}
                        canvasHeight={layout.canvasHeight}
                        isVisible={canvasState.xySlidersVisible}
                        setIsVisible={canvasState.setXySlidersVisible}
                        onRequestFocus={onXyFocusRequest}
                    />
                )}

            {/* Globale thumbnail hover freeze overlay */}
            {hoverFreezeActive && (
                <div
                    className={`${styles.thumbnailFreeze}`}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 1,
                        pointerEvents: "none",
                    }}
                />
            )}

            {/* Development Mode Indicator (Clean, Non-Intrusive) */}
            {import.meta.env.DEV && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "10px",
                        left: "10px",
                        background: "rgba(0,100,0,0.8)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontFamily: "monospace",
                        zIndex: 1000,
                    }}
                >
                    DEV MODE | Console: window.debugCanvas.toggle()
                </div>
            )}
        </>
    );
}
