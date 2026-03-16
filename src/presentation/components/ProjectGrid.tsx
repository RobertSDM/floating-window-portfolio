"use client";

import { projects } from "@/data/projects";
import { useWindowManager } from "@/presentation/hooks/useWindowManager";
import { ProjectCard } from "@/presentation/components/ProjectCard";
import type { Project } from "@/domain/entities/Project";

/**
 * Renders all portfolio projects in a fixed 3-column grid. Owns the
 * useWindowManager instance and passes openWindow down to each card so
 * individual cards stay free of window management logic.
 */
export function ProjectGrid() {
    const { openWindow } = useWindowManager();

    return (
        <div className="grid grid-cols-3 gap-4 p-8">
            {projects.map((project: Project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    openWindow={openWindow}
                />
            ))}
        </div>
    );
}
