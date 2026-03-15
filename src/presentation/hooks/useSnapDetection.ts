import { getSnapState } from "@/application/windowUseCases";
import type { SnapState } from "@/domain/types";
import { useWindowStore } from "@/application/windowStore";

type SnapOrigin = { x: number; y: number };
type SnapDetectionReturn = {
    snapPreview: SnapState | null;
    snapOrigin: SnapOrigin | null;
    onDrag: (cursorX: number, cursorY: number) => void;
    onDragEnd: () => SnapState;
};

/**
 * Tracks the snapState and origin of the current drag.
 *
 * When snapPreview is null when no drag is active, in this state the SnapPreview should not be rendered.
 *
 * SnapOrigin holds the cursor coordinates at the moment the first snap zone
 * was activated during the current drag. It is set once per drag and used as
 * the animation origin for the SnapPreview entrance.
 */
export function useSnapDetection(): SnapDetectionReturn {
    const snapPreview = useWindowStore((state) => state.snapPreview);
    const snapOrigin = useWindowStore((state) => state.snapOrigin);
    const setSnapPreview = useWindowStore((state) => state.setSnapPreview);

    /** Updates the snap preview based on the current cursor position during drag. */
    function onDrag(cursorX: number, cursorY: number): void {
        const next = getSnapState(cursorX, cursorY);

        if (next !== "free" && snapOrigin === null) {
            setSnapPreview(next, { x: cursorX, y: cursorY });
            return;
        }

        if (next === "free") {
            setSnapPreview(next, null);
            return;
        }

        setSnapPreview(next, snapOrigin);
    }

    /**
     * Resets snapPreview and snapOrigin to null. Returns the last snapPreview.
     */
    function onDragEnd(): SnapState {
        const finalSnap = snapPreview ?? "free";
        setSnapPreview(null, null);
        return finalSnap;
    }

    return {
        snapPreview,
        snapOrigin,
        onDrag,
        onDragEnd,
    };
}
