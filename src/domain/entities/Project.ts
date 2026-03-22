import type { WindowType } from "@/domain/types";

type CLIConfig = {
    project: string;
    defaultCommand: string;
    defaultArgs?: string[];
};

type WebConfig = {
    url: string;
};

type APIEndpoint = {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    description: string;
    query?: Record<string, string>;
    body?: Record<string, unknown>;
    responseType: "json" | "text" | "image";
};

type APIConfig = {
    baseUrl: string;
    proxied?: boolean;
    endpoints: APIEndpoint[];
};

type ProjectBase<T extends WindowType, C> = {
    id: string;
    title: string;
    description: string;
    tags?: string[];
    type: T;
    windowConfig: C;
};

/**
 * Represents a portfolio project. Uses a generic discriminated union so that
 * TypeScript can automatically narrow the type of `windowConfig` based on
 * `type` — no manual type guards needed in components.
 */
export type Project =
    | ProjectBase<"cli", CLIConfig>
    | ProjectBase<"web", WebConfig>
    | ProjectBase<"api", APIConfig>;
