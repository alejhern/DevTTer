"use client";

import type { CodeSnippet } from "@/types";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

import { useVSCode } from "@/context/vscode";

export default function CodeBlock({
  codeSnippet: propSnippet,
}: {
  codeSnippet?: CodeSnippet;
}) {
  const ctx = useVSCode?.();

  const codeSnippet = ctx?.codeSnippet ?? propSnippet;
  const fullScreen = ctx?.state?.fullScreen ?? false;

  const { resolvedTheme } = useTheme() as {
    resolvedTheme?: "light" | "dark";
  };

  const [html, setHtml] = useState<string>(codeSnippet.content);

  useEffect(() => {
    if (!codeSnippet) return;

    const theme = resolvedTheme ?? "light";

    const run = async () => {
      const result = await codeToHtml(codeSnippet.content, {
        lang: codeSnippet.language,
        theme: theme === "dark" ? "one-dark-pro" : "one-light",
      });

      setHtml(result);
    };

    run();
  }, [codeSnippet, resolvedTheme]);

  if (!codeSnippet) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
      className="dark:bg-[#282c34] bg-[#FAFAFA]"
      style={{
        margin: 0,
        height: fullScreen ? "100%" : "auto",
        maxHeight: fullScreen ? "100%" : "200px",
        overflow: "auto",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
      }}
    />
  );
}
