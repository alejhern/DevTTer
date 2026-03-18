import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

export interface CodeEditorProps {
  language: string;
  code: string;
  onChange?: (_value: string) => void;
  fullScreen?: boolean;
}

export default function CodeEditor({
  language,
  code,
  onChange,
  fullScreen = false,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme() as { resolvedTheme: "light" | "dark" };

  return (
    <Editor
      height={fullScreen ? "100%" : "200px"}
      language={language}
      options={{
        automaticLayout: true,
        bracketPairColorization: { enabled: true },
        contextmenu: true,
        cursorSmoothCaretAnimation: "on",
        fontSize: 14,
        fontFamily: "Fira Code, monospace",
        lineNumbers: "on",
        minimap: { enabled: true },
        quickSuggestions: true,
        renderLineHighlight: "all",
        roundedSelection: true,
        scrollBeyondLastColumn: 0,
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        suggestOnTriggerCharacters: true,
        tabSize: 2,
        wordWrap: "on",
      }}
      theme={resolvedTheme === "dark" ? "vs-dark" : "vs-light"}
      value={code}
      onChange={(val) => onChange && onChange(val ?? "")}
    />
  );
}
