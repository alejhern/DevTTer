import type { CodeSnippet, UIAction } from "@/types";

import { useCallback, useRef } from "react";

import { supportedLanguages } from "@/config/site";

export function useRunner(
  codeSnippet: CodeSnippet,
  config:
    | (typeof supportedLanguages)[keyof typeof supportedLanguages]
    | undefined,
  dispatch: React.Dispatch<UIAction>, // ← mismo dispatch, mismas acciones
) {
  const abortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const run = useCallback(async () => {
    if (!config) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    isMountedRef.current = true;

    dispatch({ type: "RUN_START" });

    try {
      if (config.type === "iframe") {
        dispatch({ type: "RUN_DONE", payload: codeSnippet.content });
      } else if (config.type === "frontend") {
        const logs: string[] = [];
        const original = console.log;

        console.log = (...args) => {
          logs.push(args.join(" "));
        };
        try {
          new Function(codeSnippet.content)();
        } finally {
          console.log = original;
        }
        if (isMountedRef.current) {
          dispatch({
            type: "RUN_DONE",
            payload: logs.join("\n") || "Executed with no output",
          });
        }
      } else if (config.type === "backend") {
        const baseUrl =
          process.env.NEXT_PUBLIC_SANDBOX_URL || "http://localhost:4000";
        const res = await fetch(`${baseUrl}/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(codeSnippet),
          signal: abortRef.current.signal,
        });
        const data = await res.json();

        if (isMountedRef.current) {
          dispatch(
            data.stderr
              ? { type: "RUN_ERROR", payload: data.stderr }
              : { type: "RUN_DONE", payload: data.stdout || "No output" },
          );
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") return;
      if (isMountedRef.current) {
        dispatch({ type: "RUN_ERROR", payload: e.message });
      }
    }
  }, [config, codeSnippet, dispatch]);

  const cancel = useCallback(() => {
    isMountedRef.current = false;
    abortRef.current?.abort();
  }, []);

  return { run, cancel };
}
