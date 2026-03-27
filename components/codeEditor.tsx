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
    <div style={{ height: fullScreen ? "100%" : "200px", width: "100%" }}>
      <Editor
        height="100%"
        language={language}
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
        value={code}
        width="100%"
        onChange={(val) => onChange && onChange(val ?? "")}
      />
    </div>
  );
}
