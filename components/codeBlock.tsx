"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false },
);

type CodeBlockProps = {
  code: string;
  language: string;
};

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
      {/* Header estilo VSCode */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs font-medium text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
            {language}
          </span>
        </div>

        <button
          className="text-xs px-3 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700 
          hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
          onClick={handleCopy}
        >
          {copied ? "yanked ✓" : "yank"}
        </button>
      </div>
      {/* Código */}
      <SyntaxHighlighter
        customStyle={{
          margin: 0,
          padding: "0.75rem 1rem",
          background: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
          borderLeft:
            theme === "dark" ? "4px solid #007acc" : "4px solid #007acc",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        language={language}
        lineNumberStyle={{
          color: theme === "dark" ? "#555" : "#aaa",
          paddingRight: "1rem",
        }}
        showLineNumbers={true}
        style={theme === "dark" ? oneDark : oneLight}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
