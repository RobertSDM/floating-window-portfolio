/**
 * Represents the snap state of a window.
 * When free, the window is positioned using its stored x/y coordinates.
 * When left, right or fullscreen, CSS styles override those coordinates to
 * cover the corresponding portion of the viewport.
 */
export type SnapState = "free" | "left" | "right" | "fullscreen";

/**
 * Each value corresponds to a specialized
 * window component in the presentation layer.
 */
export type WindowType = "cli" | "web" | "api";


/**
 * Represents the coordinates for a snap state.
 */
export type SnapCords = {x: number, y: number}