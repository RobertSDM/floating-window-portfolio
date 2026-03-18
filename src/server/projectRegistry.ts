import path from "node:path";

type CLIEntry = { type: "cli"; data: { bin: string } };
type APIEntry = { type: "api"; data: { token: string } };
type WebEntry = { type: "web"; data: { url: string } };

type ProjectEntry = CLIEntry | APIEntry | WebEntry;

export const projectRegistry: Record<string, ProjectEntry> = {
    clc: { type: "cli", data: { bin: path.resolve(process.cwd(), "bin/clc") } },
};
