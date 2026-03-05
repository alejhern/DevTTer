import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  language: string;
  code: string;
  onChange?: (_value: string) => void;
  theme?: "light" | "dark";
  fullScreen?: boolean;
};

export default function CodeEditor({
  language,
  code,
  onChange,
  theme = "light",
  fullScreen = false,
}: CodeEditorProps) {
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
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      value={code}
      onChange={(val) => onChange && onChange(val ?? "")}
    />
  );
}
