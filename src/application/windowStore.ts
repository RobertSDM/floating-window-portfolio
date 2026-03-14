import { create } from "zustand";
import type { WindowEntity } from "@/domain/entities/Window";

interface WindowStore {
    windows: WindowEntity[];

    /** Appends a new window to the end of the array. */
    addWindow: (window: WindowEntity) => void;

    /** Removes the window with the given id from the array. */
    closeWindow: (id: string) => void;

    /** Applies partial changes to the window with the given id. */
    updateWindow: (id: string, changes: Partial<WindowEntity>) => void;

    /** Replaces the entire windows array. */
    setWindows: (windows: WindowEntity[]) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
    windows: [],

    addWindow: (window) =>
        set((state) => ({ windows: [...state.windows, window] })),

    closeWindow: (id) =>
        set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),

    updateWindow: (id, changes) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, ...changes } : w,
            ),
        })),

    setWindows: (windows) => set({ windows }),
}));
