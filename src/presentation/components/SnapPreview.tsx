import { motion, AnimatePresence } from "framer-motion";
import type { SnapCords, SnapState } from "@/domain/types";
import { useEffect } from "react";
import { SNAP_THRESHOLD } from "@/application/windowUseCases";

type SnapCoords = {
    top: number | string;
    left: number | string;
    width: number | string;
    height: number | string;
};

type Props = {
    snapPreview: SnapState;
    snapOrigin: SnapCords;
};

function getSnapCoords(
    cords: { x: number; y: number },
    snap: SnapState,
): SnapCoords {
    switch (snap) {
        case "fullscreen":
            return {
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
            };
        case "left":
            return {
                top: 0,
                left: 0,
                width: "50vw",
                height: "100vh",
            };
        case "right":
            return {
                top: 0,
                left: "50vw",
                width: "50vw",
                height: "100vh",
            };
        case "free":
            return { top: 0, left: 0, width: 0, height: 0 };
    }
}

/**
 * Renders a translucent snap zone preview overlay during window dragging.
 * Animates from the cursor origin to the target snap coordinates, and
 * transitions smoothly between snap zones without unmounting.
 */
export function SnapPreview({ snapPreview, snapOrigin }: Props) {
    const cords = getSnapCoords(snapOrigin, snapPreview);

    return (
        <AnimatePresence>
            {snapPreview !== "free" && (
                <motion.div
                    key="snap-preview"
                    className="fixed pointer-events-none z-50 rounded-lg border border-snap-border bg-snap-fill shadow-snap-glow"
                    initial={{
                        top: Math.max(0, snapOrigin.y - SNAP_THRESHOLD),
                        left: Math.max(0, snapOrigin.x - SNAP_THRESHOLD),
                        width: 0,
                        height: 0,
                        opacity: 0,
                    }}
                    animate={{
                        ...cords,
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.98,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                />
            )}
        </AnimatePresence>
    );
}
