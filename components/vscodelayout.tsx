"use client";
import type { CodeBlockProps } from "./codeBlock";
import type { CodeEditorProps } from "./codeEditor";

import { CheckIcon, CopyIcon, FullscreenIcon } from "lucide-react";
import {
  ReactElement,
  cloneElement,
  useCallback,
  useEffect,
  useState,
} from "react";

import useMounted from "@/hooks/useMounted";

interface WindowVSCodeProps {
  children: ReactElement<CodeBlockProps | CodeEditorProps>;
}

function IconButton({
  onClick,
  title,
  children,
  active,
}: {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className="flex items-center justify-center w-7 h-7 rounded transition-all duration-150"
      style={{
        color: active ? "#a0a0b8" : "#4a4a5a",
        background: "transparent",
      }}
      title={title}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#1e1e28";
        (e.currentTarget as HTMLButtonElement).style.color = "#c8c8d8";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = active
          ? "#a0a0b8"
          : "#4a4a5a";
      }}
    >
      {children}
    </button>
  );
}

export default function WindowVSCode({ children }: WindowVSCodeProps) {
  const mounted = useMounted();
  const [copied, setCopied] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullScreen) {
        setFullScreen(false);
      }
    };

    if (fullScreen) {
      window.addEventListener("keydown", handleEscape);

      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [fullScreen]);

  const handlerCopy = useCallback(async (targetValue: string) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard API not available");

      return;
    }
    await navigator.clipboard.writeText(targetValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  if (!children) {
    throw new Error("VScode requires a single React element as children");
  }

  const props = children.props as CodeBlockProps | CodeEditorProps;
  const language = props.language;
  const code = props.code;

  const childWithFullScreen = fullScreen
    ? cloneElement(children, { fullScreen: true } as Partial<
        CodeBlockProps | CodeEditorProps
      >)
    : children;

  return (
    <div
      className={`m-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm ${fullScreen ? "fixed inset-0 z-50 mt-16" : ""}`}
    >
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
        {mounted && (
          <div className="flex items-center gap-2">
            <IconButton
              active={copied}
              title="yank"
              onClick={() => handlerCopy(code)}
            >
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
            </IconButton>
            <IconButton
              title="Toggle Full Screen"
              onClick={() => setFullScreen((prev) => !prev)}
            >
              <FullscreenIcon size={16} />
            </IconButton>
          </div>
        )}
      </div>
      {/* Código */}
      {childWithFullScreen}
    </div>
  );
}
