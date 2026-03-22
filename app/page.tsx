"use client";
import { projects } from "@/data/projects";
import { ProjectGrid } from "@/presentation/components/ProjectGrid";
import { SnapPreview } from "@/presentation/components/SnapPreview";
import { Window } from "@/presentation/components/Window";
import { CLIWindow } from "@/presentation/components/windows/CLIWindow";
import { useSnapDetection } from "@/presentation/hooks/useSnapDetection";
import { useWindowManager } from "@/presentation/hooks/useWindowManager";

export default function Home() {
    const { windows } = useWindowManager();
    const { snapOrigin, snapPreview } = useSnapDetection();

    return (
        <div className="overflow-hidden h-screen max-h-screen w-screen bg-gray-100">
            {windows.map((win) => {
                const project = projects.find((p) => p.id === win.projectId)!;

                return (
                    <Window project={project} window={win} key={win.id}>
                        {project.type === "cli" && (
                            <CLIWindow project={project} />
                        )}
                    </Window>
                );
            })}
            {/* Snap preview overlay — only visible when cursor is near a snap zone */}
            {snapPreview !== null && snapPreview !== "free" && snapOrigin && (
                <SnapPreview
                    snapPreview={snapPreview}
                    snapOrigin={snapOrigin}
                />
            )}
            <ProjectGrid />
        </div>
    );
}
