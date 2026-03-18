import { use } from "react";
import { codeToHtml } from "shiki";

export interface CodeBlockProps {
  code: string;
  language: string;
  theme?: "light" | "dark";
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
  theme = "dark",
  fullScreen = false,
}: CodeBlockProps) {
  const html = use(getHighlightedHtml(code, language, theme));

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
      style={{
        margin: 0,
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        maxHeight: fullScreen ? "none" : "200px",
        height: fullScreen ? "85vh" : "auto",
        overflow: "auto",
        background: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
      }}
    />
  );
}
