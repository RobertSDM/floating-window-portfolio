import type { Project } from "@/domain/entities/Project";
import type { WindowEntity } from "@/domain/entities/Window";
import type { SnapState } from "@/domain/types";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 520;
export const MAX_WINDOWS = 3;
export const SNAP_THRESHOLD = 5;

/**
 * Creates a new WindowEntity centered in the viewport for the given project.
 * Returns null if the maximum number of open windows has been reached.
 */
export function openWindow(
    project: Project,
    windows: WindowEntity[],
): WindowEntity | null {
    if (windows.length >= MAX_WINDOWS) return null;

    const x = (window.innerWidth - DEFAULT_WIDTH) / 2;
    const y = (window.innerHeight - DEFAULT_HEIGHT) / 2;

    return {
        id: crypto.randomUUID(),
        projectId: project.id,
        x,
        y,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        snapState: "free",
    };
}

/**
 * Brings the window with the given id to the front by moving it to the end of
 * the array. The last element in the array is always rendered on top.
 */
export function focusWindow(
    id: string,
    windows: WindowEntity[],
): WindowEntity[] {
    const target = windows.find((w) => w.id === id);
    if (!target) return windows;

    return [...windows.filter((w) => w.id !== id), target];
}

/**
 * Updates the snapState of the window with the given id.
 * Free-position coordinates (x, y, width, height) are always preserved in the
 * entity regardless of snap state, so no additional logic is needed to restore
 * them when the window returns to 'free'.
 */
export function setSnapState(
    id: string,
    snapState: SnapState,
    windows: WindowEntity[],
): WindowEntity[] {
    return windows.map((w) => (w.id === id ? { ...w, snapState } : w));
}

/**
 * Computes the SnapState for a window based on the current cursor position.
 * A snap is triggered when the cursor is within SNAP_THRESHOLD pixels of a
 * viewport edge. Dragging to the top edge snaps to fullscreen, left and right
 * edges snap to the corresponding half of the screen.
 */
export function getSnapState(cursorX: number, cursorY: number): SnapState {
    const { innerWidth } = window;

    if (cursorY < SNAP_THRESHOLD) return "fullscreen";
    if (cursorX < SNAP_THRESHOLD) return "left";
    if (cursorX > innerWidth - SNAP_THRESHOLD) return "right";

    return "free";
}
