"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import type { WindowEntity } from "@/domain/entities/Window";
import type { Project } from "@/domain/entities/Project";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowManager } from "@/presentation/hooks/useWindowManager";
import { useSnapDetection } from "@/presentation/hooks/useSnapDetection";
import { WindowTitleBar } from "@/presentation/components/WindowTitleBar";
import { useEffect } from "react";
import { SnapState } from "@/domain/types";

type Props = {
    window: WindowEntity;
    project: Project;
    children: React.ReactNode;
};

type SnapCords = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const SPRING_CONFIG = { stiffness: 300, damping: 35 };

/**
 * Generic shell for all window types. Manages drag, snap detection, fullscreen
 * toggle and focus. Renders the macOS-style chrome and delegates content
 * rendering entirely to children — this component has no knowledge of what
 * lives inside.
 */
export function Window({ window: windowEntity, project, children }: Props) {
    const { closeWindow, focusWindow, updateWindow, setSnapState } =
        useWindowManager();
    const { onDrag, onDragEnd } = useSnapDetection();

    const motionX = useSpring(windowEntity.x, SPRING_CONFIG);
    const motionY = useSpring(windowEntity.y, SPRING_CONFIG);
    const motionWidth = useSpring(windowEntity.width, SPRING_CONFIG);
    const motionHeight = useSpring(windowEntity.height, SPRING_CONFIG);

    const cursor = useMotionValue({ x: 0, y: 0 });

    useEffect(() => {
        function listener(event: MouseEvent) {
            cursor.set({ x: event.clientX, y: event.clientY });
        }

        window.addEventListener("mousemove", listener);

        return () => window.removeEventListener("mousemove", listener);
    }, []);

    function getStyles(state: SnapState): SnapCords {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        switch (state) {
            case "fullscreen":
                return { x: 0, y: 0, width: vw, height: vh };
            case "left":
                return { x: 0, y: 0, width: vw / 2, height: vh };
            case "right":
                return { x: vw / 2, y: 0, width: vw / 2, height: vh };
            case "free":
                return {
                    x: motionX.get(),
                    y: motionY.get(),
                    width: windowEntity.width,
                    height: windowEntity.height,
                };
        }
    }

    function handleStyles() {
        const styles = getStyles(windowEntity.snapState);
        motionX.set(styles.x);
        motionY.set(styles.y);
        motionWidth.set(styles.width);
        motionHeight.set(styles.height);
    }

    useEffect(() => {
        handleStyles();
        window.addEventListener("resize", handleStyles);

        return () => window.removeEventListener("resize", handleStyles);
    }, [windowEntity.snapState]);

    const bind = useDrag(
        ({
            event,
            xy: [cursorX, cursorY],
            offset: [ox, oy],
            first,
            last,
            tap,
        }) => {
            event.preventDefault();

            if (tap) return;

            if (first && windowEntity.snapState !== "free") {
                setSnapState(windowEntity.id, "free");

                let state = getStyles("free");
                motionWidth.set(state.width);
                motionHeight.set(state.height);
            }

            motionX.jump(ox);
            motionY.jump(oy);

            if (motionX.get() < 0) motionX.jump(0);
            if (motionY.get() < 0) motionY.jump(0);
            if (motionX.get() > window.innerWidth - windowEntity.width / 2)
                motionX.jump(window.innerWidth - windowEntity.width / 2);
            if (motionY.get() > window.innerHeight - windowEntity.height / 2)
                motionY.jump(window.innerHeight - windowEntity.height / 2);

            onDrag(cursorX, cursorY);

            if (last) {
                console.log("drag end");
                const finalSnap = onDragEnd();

                if (finalSnap === windowEntity.snapState) {
                    handleStyles();
                }

                setSnapState(windowEntity.id, finalSnap);
                updateWindow(windowEntity.id, {
                    x: motionX.get(),
                    y: motionY.get(),
                });
            }
        },
        // "from" is run before the drag starts
        {
            from: () => {
                if (windowEntity.snapState !== "free") {
                    let relativeX =
                        cursor.get().x -
                        windowEntity.width *
                            (cursor.get().x / window.innerWidth);

                    motionX.set(relativeX);

                    return [relativeX, motionY.get()];
                }

                return [motionX.get(), motionY.get()];
            },
        },
    );

    function handleToggleFullscreen(): void {
        setSnapState(
            windowEntity.id,
            windowEntity.snapState === "fullscreen" ? "free" : "fullscreen",
        );
    }

    function borderRadius() {
        if (windowEntity.snapState === "free") return "rounded-xl";
        else if (windowEntity.snapState === "left") return "rounded-r-xl";
        else if (windowEntity.snapState === "right") return "rounded-l-xl ";
        else if (windowEntity.snapState === "fullscreen") return "rounded-none";
    }

    return (
        <motion.div
            className={`fixed flex flex-col overflow-hidden ${borderRadius()} border border-window-border bg-window-body-bg shadow-2xl`}
            style={{
                x: motionX,
                y: motionY,
                width: motionWidth,
                height: motionHeight,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            onPointerDown={() => {
                focusWindow(windowEntity.id);
            }}
        >
            <WindowTitleBar
                title={project.title}
                snapState={windowEntity.snapState}
                onClose={() => closeWindow(windowEntity.id)}
                toggleFullscreen={handleToggleFullscreen}
                dragProps={bind()}
            />

            <div className="flex-1 overflow-auto">{children}</div>
        </motion.div>
    );
}
