import type { CodeSnippet, LanguagesKey } from "@/types";

import { useCallback, useEffect, useState } from "react";

import CodeEditor from "./codeEditor";

import { supportedLanguages } from "@/config/site";
import WindowVSCode from "@/context/vscode";

const DEFAULT_LANGUAGE: LanguagesKey = "typescript";
const DEFAULT_SNIPPET: CodeSnippet = {
  language: DEFAULT_LANGUAGE,
  content: "",
};

export function CodeInput({
  codeSnipetRef = { current: undefined },
  initialCode,
}: {
  codeSnipetRef: React.MutableRefObject<CodeSnippet | undefined>;
  initialCode?: CodeSnippet;
}) {
  const [codeSnippet, setCodeSnippet] = useState<CodeSnippet>(
    () => initialCode ?? DEFAULT_SNIPPET,
  );

  // Sincronizar ref en el montaje inicial
  useEffect(() => {
    codeSnipetRef.current = codeSnippet;
  }, []);

  // Si initialCode llega tarde (fetch), actualizar estado y ref
  useEffect(() => {
    if (!initialCode) return;
    setCodeSnippet(initialCode);
    codeSnipetRef.current = initialCode;
  }, [initialCode, codeSnipetRef]);

  const updateCode = useCallback(
    (newData: Partial<CodeSnippet>) => {
      setCodeSnippet((prev) => {
        const updated: CodeSnippet = { ...prev, ...newData };

        codeSnipetRef.current = updated;

        return updated;
      });
    },
    [codeSnipetRef],
  );

  return (
    <>
      <div className="flex gap-4 items-center mb-3">
        <select
          className="text-xs border rounded-md px-2 py-1 dark:bg-zinc-800 dark:border-zinc-700"
          value={codeSnippet.language}
          onChange={(e) =>
            updateCode({ language: e.target.value as LanguagesKey })
          }
        >
          {Object.entries(supportedLanguages).map(([key, lang]) => (
            <option key={key} value={key}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <WindowVSCode codeSnippet={codeSnippet}>
        <CodeEditor onChange={(value) => updateCode({ content: value })} />
      </WindowVSCode>
    </>
  );
}
