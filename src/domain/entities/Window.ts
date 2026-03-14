import type { SnapState } from "@/domain/types";

/**
 * Represents an open window in the window management system.
 *
 * The free-position coordinates (x, y, width, height) and snapState are stored
 * separately so that when a window is unsnapped, it can restore its previous
 * position.
 *
 * The window order is implied by the order of the windows array
 * in the store.
 */
export type WindowEntity = {
    id: string;
    projectId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    snapState: SnapState;
};
