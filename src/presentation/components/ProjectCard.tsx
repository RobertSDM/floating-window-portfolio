"use client";

import type { Project } from "@/domain/entities/Project";

type Props = {
    project: Project;
    openWindow: (project: Project) => void;
};

const typeStyles = {
    cli: {
        shadow: "shadow-card-cli hover:shadow-card-cli-hover",
        badgeBg: "bg-cli-badge-bg",
        badgeText: "text-cli-badge-text",
    },
    api: {
        shadow: "shadow-card-api hover:shadow-card-api-hover",
        badgeBg: "bg-api-badge-bg",
        badgeText: "text-api-badge-text",
    },
    web: {
        shadow: "shadow-card-web hover:shadow-card-web-hover",
        badgeBg: "bg-web-badge-bg",
        badgeText: "text-web-badge-text",
    },
};

/**
 * Displays a single project as a card. Clicking anywhere on the card opens the
 * corresponding window.
 */
export function ProjectCard({ project, openWindow }: Props) {
    const styles = typeStyles[project.type];

    return (
        <button
            onClick={() => openWindow(project)}
            className={`w-full max-w-64 cursor-pointer rounded-lg border border-card-border bg-white p-5 text-left transition-shadow ${styles.shadow}`}
        >
            <div className="mb-1.5 flex items-center gap-2">
                <span className="text-[15px] font-bold text-gray-900">
                    {project.title}
                </span>
                <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${styles.badgeBg} ${styles.badgeText}`}
                >
                    {project.type.toUpperCase()}
                </span>
            </div>

            <p className="text-[13px] leading-relaxed text-card-desc">
                {project.description}
            </p>

            {project.tags && project.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-card-tag-bg px-2 py-0.5 text-[11px] text-card-tag-text"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </button>
    );
}
