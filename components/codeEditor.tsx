"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  language: string;
  code: string;
  onChange?: (_value: string) => void;
  theme?: "light" | "dark";
};

export default function CodeEditor({
  language,
  code,
  onChange,
  theme = "dark",
}: CodeEditorProps) {
  const [editorHeight, setEditorHeight] = useState(300);

  // Ajusta altura según contenido (opcional)
  useEffect(() => {
    const lineCount = code.split("\n").length;

    setEditorHeight(Math.max(180, lineCount * 20));
  }, [code]);

  return (
    <Editor
      height={`${editorHeight}px`}
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
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      value={code}
      onChange={(val) => onChange && onChange(val ?? "")}
    />
  );
}
