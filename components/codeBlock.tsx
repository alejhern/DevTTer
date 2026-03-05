"use client";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

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
  return (
    <SyntaxHighlighter
      key={theme}
      customStyle={{
        margin: 0,
        padding: "0.75rem 1rem",
        background: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
        borderLeft:
          theme === "dark" ? "4px solid #007acc" : "4px solid #007acc",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        height: fullScreen ? "100%" : "auto",
        maxHeight: fullScreen ? "100vh" : "200px",
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
  );
}
