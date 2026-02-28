"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

type CodeEditorProps = {
  language: string;
  value: string;
  onChange?: (_value: string) => void;
};

export default function CodeEditor({
  language,
  value,
  onChange,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [editorHeight, setEditorHeight] = useState(300);

  // Ajusta altura según contenido (opcional)
  useEffect(() => {
    const lineCount = value.split("\n").length;

    setEditorHeight(Math.max(180, lineCount * 20));
  }, [value]);

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
      </div>

      {/* Editor */}
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
        value={value}
        onChange={(val) => onChange && onChange(val ?? "")}
      />
    </div>
  );
}
