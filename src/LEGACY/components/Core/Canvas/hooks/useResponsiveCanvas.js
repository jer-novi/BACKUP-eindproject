import {useState, useMemo} from "react";
import {useWindowSize} from "../../../hooks/useWindowSize";

/**
 * useResponsiveCanvas
 *
 * Custom React hook for managing responsive canvas layout in a frontend application.
 * Calculates the optimal widths for the canvas, controls panel, and navigation panel
 * based on the current window size, while maintaining minimum width constraints for usability.
 *
 * Controls panel: minimum 340px
 * Navigation panel: minimum 120px
 * Canvas: minimum 300px width, 200px height
 *
 * This hook ensures a robust and user-friendly responsive layout for the canvas.
 *
 * @returns {Object} Layout state and handlers for toggling controls and navigation visibility.
 */
export function useResponsiveCanvas() {
    // Get current window dimensions using a custom window size hook
    const {width: windowWidth, height: windowHeight} = useWindowSize();

    // State to control visibility of the controls and navigation panels
    const [controlsVisible, setControlsVisible] = useState(true);
    const [navVisible, setNavVisible] = useState(true);

    // Memoized calculation of layout dimensions based on window size and panel visibility
    const layout = useMemo(() => {
        // Minimum and base dimensions for layout elements
        const baseControlsWidth = 340;
        const baseNavWidth = 120;
        const baseScreenWidth = 1920;

        // Calculate controls panel width, respecting minimum width
        const controlsWidth = controlsVisible
            ? Math.max(
                baseControlsWidth,
                (baseControlsWidth / baseScreenWidth) * windowWidth
            )
            : 0;
        // Calculate navigation panel width, respecting minimum width
        const navWidth = navVisible
            ? Math.max(baseNavWidth, (baseNavWidth / baseScreenWidth) * windowWidth)
            : 0;

        // Canvas occupies the remaining horizontal space
        const canvasWidth = windowWidth - controlsWidth - navWidth;

        return {
            windowWidth, // Current window width
            windowHeight, // Current window height
            controlsWidth: Math.round(controlsWidth), // Calculated controls panel width
            navWidth: Math.round(navWidth), // Calculated navigation panel width
            canvasWidth: Math.max(300, Math.round(canvasWidth)), // Enforce minimum canvas width
            canvasHeight: Math.max(200, Math.round(canvasHeight)), // Enforce minimum canvas height
            controlsVisible, // Controls panel visibility state
            navVisible, // Navigation panel visibility state
            leftSpacer: 0, // Reserved for future use (no spacers currently)
            rightSpacer: 0, // Reserved for future use (no spacers currently)
        };
    }, [windowWidth, windowHeight, controlsVisible, navVisible]);

    /**
     * Toggles the visibility of the controls panel.
     */
    const toggleControls = () => setControlsVisible(!controlsVisible);

    /**
     * Toggles the visibility of the navigation panel.
     */
    const toggleNav = () => setNavVisible(!navVisible);

    // Return layout state and toggle handlers for use in components
    return {
        ...layout,
        toggleControls,
        toggleNav,
    };
}
