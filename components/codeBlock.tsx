"use client";
import { useTheme } from "next-themes";
import { use } from "react";
import { codeToHtml } from "shiki";

export interface CodeBlockProps {
  code: string;
  language: string;
  fullScreen?: boolean;
}

const highlightCache = new Map<string, Promise<string>>();

function getHighlightedHtml(
  code: string,
  language: string,
  theme: "light" | "dark",
) {
  const key = `${code}:${language}:${theme}`;

  if (!highlightCache.has(key)) {
    highlightCache.set(
      key,
      codeToHtml(code, {
        lang: language,
        theme: theme === "dark" ? "one-dark-pro" : "one-light",
      }),
    );
  }

  return highlightCache.get(key)!;
}

export default function CodeBlock({
  code,
  language,
  fullScreen = false,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme() as { resolvedTheme: "light" | "dark" };
  const html = use(getHighlightedHtml(code, language, resolvedTheme));

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
      className="dark:bg-[#282c34] bg-[#FAFAFA]"
      style={{
        margin: 0,
        height: fullScreen ? "100%" : "200px",
        maxHeight: fullScreen ? "100%" : "200px",
        overflow: "auto",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
      }}
    />
  );
}
