"use client";

import type { Project } from "@/domain/entities/Project";
import {
    openWindow,
    focusWindow,
    setSnapState,
    MAX_WINDOWS,
} from "@/application/windowUseCases";
import { useWindowStore } from "@/application/windowStore";
import { WindowEntity } from "@/domain/entities/Window";
import { SnapState } from "@/domain/types";

type windowManagerReturn = {
    windows: WindowEntity[];
    openWindow: (project: Project) => void;
    closeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    updateWindow: (id: string, changes: Partial<WindowEntity>) => void;
    setSnapState: (id: string, snapState: SnapState) => void;
};

/**
 * Primary interface between UI components and the window management system.
 * Orchestrates use cases and store actions.
 */
export function useWindowManager(): windowManagerReturn {
    const windows = useWindowStore((state) => state.windows);
    const addWindow = useWindowStore((state) => state.addWindow);
    const closeWindow = useWindowStore((state) => state.closeWindow);
    const updateWindow = useWindowStore((state) => state.updateWindow);
    const setWindows = useWindowStore((state) => state.setWindows);

    /**
     * Creates a new window for the given project and adds it to the store.
     * Returns false if the maximum number of open windows has been reached.
     */
    function handleOpenWindow(project: Project): void {
        if (windows.length >= MAX_WINDOWS) closeWindow(windows[0].id);
        const window = openWindow(project, windows);

        addWindow(window!);
    }

    /**
     * Brings the window with the given id to the front.
     */
    function handleFocusWindow(id: string): void {
        const reordered = focusWindow(id, windows);
        setWindows(reordered);
    }

    /**
     * Updates the snapState of the window with the given id and persists the
     * reordered array to the store.
     */
    function handleSetSnapState(id: string, snapState: SnapState): void {
        const updated = setSnapState(id, snapState, windows);
        setWindows(updated);
    }

    return {
        windows,
        openWindow: handleOpenWindow,
        closeWindow,
        focusWindow: handleFocusWindow,
        updateWindow,
        setSnapState: handleSetSnapState,
    };
}
