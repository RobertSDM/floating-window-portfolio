import type { Project } from "@/domain/entities/Project";

export const projects: Project[] = [
    {
        id: "clc",
        title: "Calculatora CLI",
        description:
            "Uma calculadora de terminal que consegue interpretar expressões matemáticas",
        type: "cli",
        windowConfig: {
            project: "clc",
            defaultCommand: "clc",
        },
        tags: ["Python"],
    },
];
