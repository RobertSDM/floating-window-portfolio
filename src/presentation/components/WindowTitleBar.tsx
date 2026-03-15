import { SnapState } from "@/domain/types";

type Props = {
    title: string;
    onClose: () => void;
    toggleFullscreen: () => void;
    snapState: SnapState;
    dragProps: Record<string, unknown>;
};

/**
 * Renders the macOS-style title bar for a window. Acts as the drag handle for
 * the window and hosts the three control buttons and the centered title.
 * All state logic (fullscreen toggle, drag) lives in Window.tsx — this
 * component only renders and forwards events.
 */
export function WindowTitleBar({
    title,
    onClose,
    snapState,
    toggleFullscreen,
    dragProps,
}: Props) {
    return (
        <div
            className={`flex ${snapState === "fullscreen" ? "h-8" : "h-11"} cursor-grab items-center rounded-t-xl border-b border-titlebar-border bg-titlebar-bg px-4 active:cursor-grabbing touch-none select-none`}
            onDoubleClick={toggleFullscreen}
            {...dragProps}
        >
            <div className="flex items-center gap-2">
                {/* Red — close */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="group flex h-3 w-3 items-center justify-center rounded-full bg-btn-close transition-[filter] hover:brightness-90"
                    aria-label="Close window"
                >
                    <span className="hidden text-[8px] leading-none text-btn-icon group-hover:block">
                        ✕
                    </span>
                </button>

                {/* Yellow — close (minimise not supported) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="group flex h-3 w-3 items-center justify-center rounded-full bg-btn-minimize transition-[filter] hover:brightness-90"
                    aria-label="Close window"
                >
                    <span className="hidden text-[8px] leading-none text-btn-icon group-hover:block">
                        −
                    </span>
                </button>

                {/* Green — toggle fullscreen */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
                    }}
                    className="group flex h-3 w-3 items-center justify-center rounded-full bg-btn-fullscreen transition-[filter] hover:brightness-90"
                    aria-label="Toggle fullscreen"
                >
                    <span className="hidden text-[8px] leading-none text-btn-icon group-hover:block">
                        +
                    </span>
                </button>
            </div>

            <span className="pointer-events-none absolute -inset-x-0 text-center text-sm font-medium text-titlebar-title">
                {title}
            </span>
        </div>
    );
}
