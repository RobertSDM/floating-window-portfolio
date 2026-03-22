import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const BLOCKED_PATTERNS = ["&&", "||", "!!", "!$", "|", "&", "!", "<", ">"];

/**
 * Removes potentially dangerous shell operators from each argument string.
 */
export function sanitizeArgs(args: string[]): string[] {
    return args.map((arg) => {
        let sanitized = arg;
        for (const pattern of BLOCKED_PATTERNS) {
            sanitized = sanitized.split(pattern).join("");
        }
        return sanitized;
    });
}

/**
 * Executes a binary with the given arguments and returns its stdout output.
 * Returns null if the process exits with a non-zero code, times out, or
 * fails to start.
 */
export async function executeCommand(
    bin: string,
    args: string[],
): Promise<string | null> {
    try {
        const { stdout } = await execFileAsync(bin, args, { timeout: 10_000 });
        return stdout;
    } catch {
        return null;
    }
}
