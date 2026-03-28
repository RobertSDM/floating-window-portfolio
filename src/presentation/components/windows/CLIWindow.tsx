"use client";

import { useState, useEffect, useRef } from "react";
import type { Project } from "@/domain/entities/Project";

type Props = {
    project: Extract<Project, { type: "cli" }>;
};

type HistoryEntry = {
    input: string;
    output: string | null;
};

const MAX_HISTORY = 20;
const SPINNER_FRAMES = ["-", "o", "O"];

/**
 * Simulates a terminal REPL for CLI projects. Sends user arguments to the
 * server and displays the output inline.
 */
export function CLIWindow({ project }: Props) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [spinnerFrame, setSpinnerFrame] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const historyPointer = useRef<number>(-1);

    // hold the input value state when the history is being searched
    const currentInputHolder = useRef<string | null>(null);

    // spinner interval
    useEffect(() => {
        inputRef.current?.focus();

        if (!isLoading) return;
        if (timer.current) clearInterval(timer.current);

        timer.current = setInterval(() => {
            setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length);
        }, 100);

        return () => {
            clearInterval(timer.current!);
            timer.current = null;
        };
    }, [isLoading]);

    // ctrl+l clears the terminal
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.ctrlKey && e.key === "l") {
                e.preventDefault();
                clearHistory();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    function clearHistory() {
        setHistory([]);
        inputRef.current?.focus();
    }

    function addEntry(entry: HistoryEntry) {
        setHistory((prev) => {
            const next = [...prev, entry];
            return next.slice(next.length - MAX_HISTORY);
        });
    }

    function updateLastOutput(output: string) {
        setHistory((prev) => {
            const next = [...prev];
            next[next.length - 1] = { ...next[next.length - 1], output };
            return next;
        });
    }

    async function handleSubmit() {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        setInput("");

        if (trimmed === "clear") {
            clearHistory();
            return;
        }

        const args = trimmed.split(/\s+/);
        addEntry({ input: trimmed, output: null });
        setIsLoading(true);

        const response = await fetch(
            `/api/cli/${project.windowConfig.project}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ args }),
            },
        ).catch(() => null);

        const data = response ? await response.json().catch(() => null) : null;
        const output = data?.output ?? "ocorreu um erro ao executar o comando";

        updateLastOutput(output);
        setIsLoading(false);
    }

    return (
        <div
            className="flex h-full flex-col bg-window-body-bg px-2 font-mono text-sm text-green-400 "
            onClick={() => inputRef.current?.focus()}
        >
            {/* History */}
            <div className="flex-1 py-4 cliwindow-scrollbar overflow-y-auto">
                {history.map((entry, i) => (
                    <div key={i} className="mb-2 text-lg">
                        {/* Input line */}
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 font-bold">$</span>
                            <span className="text-green-300">
                                {`${project.windowConfig.defaultCommand} ${entry.input}`}
                            </span>
                        </div>

                        {/* Output or spinner */}
                        <pre className="mt-0.5 whitespace-pre-wrap text-green-200">
                            {!entry.output
                                ? SPINNER_FRAMES[spinnerFrame]
                                : entry.output}
                        </pre>
                    </div>
                ))}
                {/* Input line */}
                <div className="flex items-center gap-2 border-t border-white/10 pt-3 text-lg">
                    <span className="text-green-400 font-bold">$</span>
                    <span className="bg-transparent text-green-300 outline-none placeholder:text-green-800 disabled:opacity-50">
                        {project.windowConfig.defaultCommand}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                historyPointer.current = -1;
                                handleSubmit();
                            }
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                if (isLoading) return;

                                if (
                                    history.length === 0 ||
                                    historyPointer.current === -1
                                )
                                    return;

                                if (
                                    historyPointer.current ===
                                    history.length - 1
                                ) {
                                    setInput(currentInputHolder.current!);
                                    currentInputHolder.current = null;
                                    historyPointer.current = -1;
                                } else {
                                    historyPointer.current += 1;
                                    setInput(
                                        history[historyPointer.current + 1]
                                            .input,
                                    );
                                }
                            }
                            if (e.key === "ArrowUp") {
                                e.preventDefault();
                                if (isLoading) return;

                                if (
                                    history.length === 0 ||
                                    historyPointer.current === 0
                                )
                                    return;

                                if (historyPointer.current === -1) {
                                    currentInputHolder.current = input;
                                    historyPointer.current = history.length;
                                }

                                historyPointer.current -= 1;
                                setInput(history[historyPointer.current].input);
                            }
                        }}
                        disabled={isLoading}
                        className="flex-1 bg-transparent text-green-300 outline-none placeholder:text-green-800 disabled:opacity-50"
                        placeholder="digite os argumentos..."
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}
