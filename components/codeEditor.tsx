import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

import { useVSCode } from "@/context/vscode";

export interface CodeEditorProps {
  onChange: (_value: string) => void;
}

export default function CodeEditor({ onChange }: CodeEditorProps) {
  const { resolvedTheme } = useTheme() as { resolvedTheme: "light" | "dark" };
  const ctx = useVSCode();

  // ✅ prioridad: context > props
  const codeSnippet = ctx?.codeSnippet;
  const fullScreen = ctx?.state?.fullScreen ?? false;

  return (
    <div style={{ height: fullScreen ? "100%" : "200px", width: "100%" }}>
      <Editor
        height="100%"
        language={codeSnippet?.language}
        options={{
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          contextmenu: true,
          cursorSmoothCaretAnimation: "on",
          fontSize: 14,
          fontFamily: "Fira Code, monospace",
          lineNumbers: "on",
          minimap: { enabled: fullScreen }, // minimap only useful in fullscreen
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
        value={codeSnippet?.content ?? ""}
        width="100%"
        onChange={(val) => onChange && onChange(val ?? "")}
      />
    </div>
  );
}
