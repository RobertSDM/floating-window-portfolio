import type { Project } from "@/domain/entities/Project";

export const projects: Project[] = [
    {
        id: "clc",
        title: "Calculatora CLI",
        repoLink: "https://github.com/RobertSDM/terminalCalculator",
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
