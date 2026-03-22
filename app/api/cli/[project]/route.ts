import { NextRequest, NextResponse } from "next/server";
import { projectRegistry } from "@/server/projectRegistry";
import { sanitizeArgs, executeCommand } from "@/server/utils";

const DEFAULT_ERROR_MESSAGE = "ocorreu um erro ao executar o comando";

/**
 * POST /api/cli/[project]
 *
 * Executes a registered CLI binary with the provided arguments and returns
 * its output.
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { project: string } },
) {
    const entry = projectRegistry[params.project];

    if (!entry || entry.type !== "cli") {
        return NextResponse.json(
            { error: "project not found" },
            { status: 404 },
        );
    }

    const body = await request.json();

    if (
        !body ||
        !Array.isArray(body.args) ||
        !body.args.every((a: unknown) => typeof a === "string")
    ) {
        return NextResponse.json(
            { error: "invalid request body" },
            { status: 422 },
        );
    }

    const sanitized = sanitizeArgs(body.args);
    const output = await executeCommand(entry.data.bin, sanitized);

    if (output === null) {
        return NextResponse.json(
            { error: DEFAULT_ERROR_MESSAGE },
            { status: 400 },
        );
    }

    return NextResponse.json({ output });
}
