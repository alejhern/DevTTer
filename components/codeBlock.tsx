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
  theme?: "light" | "dark";
};

export default function CodeBlock({
  code,
  language,
  theme = "dark",
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
