"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import VscodeLayout from "@/components/vscode-layout";
import { supportedLanguages } from "@/config/site";
import { useRunner } from "@/hooks/useRunner";
import { vsCodeReducer } from "@/reducers/vscode";

// ─────────────────────────────────────────────
// CONTEXT (estado estable del editor)
// ─────────────────────────────────────────────

const VSCodeContext = createContext<any>(null);

export const useVSCode = () => useContext(VSCodeContext);

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

export default function WindowVSCode({
  children,
  codeSnippet,
}: {
  children: React.ReactElement;
  codeSnippet: any;
}) {
  const [state, dispatch] = useReducer(vsCodeReducer, {
    copied: false,
    fullScreen: false,
    output: "",
    status: "idle",
    showOutput: false,
  });

  const config = useMemo(
    () =>
      supportedLanguages[
        codeSnippet.language as keyof typeof supportedLanguages
      ],
    [codeSnippet.language],
  );

  const { run, cancel } = useRunner(codeSnippet, config, dispatch);

  // acciones estables (NO rompen memo)
  const actions = useMemo(
    () => ({
      run,
      cancel,
      dispatch,
    }),
    [run, cancel],
  );

  const value = useMemo(
    () => ({
      state,
      actions,
      config,
      codeSnippet,
    }),
    [state, actions, config, codeSnippet],
  );

  // 🔥 ESC para salir
  useEffect(() => {
    if (!state.fullScreen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "FULLSCREEN_EXIT" });
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [state.fullScreen]);

  return (
    <VSCodeContext.Provider value={value}>
      <VscodeLayout>{children}</VscodeLayout>
    </VSCodeContext.Provider>
  );
}
