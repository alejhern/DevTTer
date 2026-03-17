"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeBlockProps = {
  code: string;
  language: string;
  theme?: "light" | "dark";
  fullScreen?: boolean;
};

export default function CodeBlock({
  code,
  language,
  theme = "dark",
  fullScreen = false,
}: CodeBlockProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedTheme = mounted ? theme : "light";

  const isDark = resolvedTheme === "dark";

  return (
    <SyntaxHighlighter
      showLineNumbers
      wrapLines
      customStyle={{
        margin: 0,
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        maxHeight: fullScreen ? "none" : "200px",
        overflow: "auto",
        background: isDark ? "#1e1e1e" : "#f5f5f5",
      }}
      language={language}
      style={isDark ? oneDark : oneLight}
    >
      {code}
    </SyntaxHighlighter>
  );
}
