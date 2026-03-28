"use client";

import type { CodeBlockProps } from "./codeBlock";
import type { CodeEditorProps } from "./codeEditor";

import {
  Check,
  Copy,
  Loader2,
  Maximize2,
  Minimize2,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import {
  ReactElement,
  cloneElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { supportedLanguages } from "@/config/site";
import useMounted from "@/hooks/useMounted";

interface Output {
  output: string;
  status?: "running" | "done" | "error";
}

interface WindowVSCodeProps {
  children: ReactElement<CodeBlockProps | CodeEditorProps>;
}

/* ================= TERMINAL ================= */
function Terminal({ output }: { output: Output }) {
  const lines = output.output.split("\n");

  const statusColor =
    output.status === "error"
      ? "text-red-500 dark:text-red-400"
      : output.status === "done"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-amber-600 dark:text-amber-400";

  const statusLabel =
    output.status === "error"
      ? "✗ error"
      : output.status === "done"
        ? "✓ done"
        : "● running";

  return (
    <div
      className="
        font-mono text-sm flex flex-col border-t
        bg-[#0d0d0f] text-[#c8c8d4] border-[#1e1e24]
        dark:bg-[#f5f5f7] dark:text-[#111114] dark:border-[#d0d0d8]
      "
      style={{ height: "auto", minHeight: 0 }}
    >
      {/* Top bar */}
      <div
        className="
          flex items-center justify-between px-4 py-2 border-b flex-shrink-0
          bg-[#111114] dark:bg-white
          border-[#1e1e24] dark:border-[#d0d0d8]
        "
      >
        <div
          className="
            flex items-center gap-2 text-xs
            text-[#5c5c6e] dark:text-[#666]
          "
        >
          <TerminalIcon size={11} />
          <span className="tracking-widest uppercase text-[10px]">output</span>
        </div>

        <span
          className={`text-[10px] tracking-wider font-medium ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-auto p-4 space-y-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className="flex gap-3 whitespace-pre-wrap leading-relaxed"
          >
            <span className="select-none text-[#2e2e38] dark:text-[#b0b0b8]">
              ▸
            </span>

            <span className="text-[#c8c8d4] dark:text-[#1a1a1a]">{line}</span>
          </div>
        ))}

        {output.status === "running" && (
          <div className="flex gap-3 mt-1">
            <span className="text-[#2e2e38] dark:text-[#b0b0b8]">▸</span>
            <span className="inline-block w-1.5 h-4 animate-pulse bg-emerald-500 dark:bg-emerald-700" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= IFRAME PREVIEW ================= */
function IframeHtml({ html }: { html: string }) {
  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2a2a35 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <iframe
        className="relative w-full h-full"
        sandbox="allow-scripts"
        srcDoc={html}
        style={{ background: "white" }}
        title="preview"
      />
    </div>
  );
}

/* ================= ICON BUTTON ================= */
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
      className={`
        flex items-center justify-center w-7 h-7 rounded
        transition-colors duration-150

        text-[#4a4a5a] hover:text-[#c8c8d8]
        hover:bg-[#1e1e28]

        dark:text-[#b0b0b8] dark:hover:text-[#1a1a1a]
        dark:hover:bg-[#e7e7ef]
      `}
      title={title}
      type="button"
      onClick={onClick}
    >
      <span className={active ? "text-[#a0a0b8] dark:text-[#2a2a2a]" : ""}>
        {children}
      </span>
    </button>
  );
}

function Header({
  language,
  copied,
  running,
  fullScreen,
  showOutput,
  onCopy,
  onRun,
  onToggleFullScreen,
  onCloseOutput,
}: {
  language: (typeof supportedLanguages)[keyof typeof supportedLanguages];
  copied: boolean;
  running: boolean;
  fullScreen: boolean;
  showOutput: boolean;
  onCopy: () => void;
  onRun: () => void;
  onToggleFullScreen: () => void;
  onCloseOutput: () => void;
}) {
  const languageName = language ? language.name : "Unknown";
  const languageColor = language ? language.color : "#5c5c6e";

  return (
    <div
      className="
        flex items-center justify-between px-4 py-2 flex-shrink-0
        bg-zinc-100 dark:bg-[#111114]
        border-b border-zinc-200 dark:border-[#1e1e24]
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />

        <span
          className="
            ml-3 text-sm font-medium uppercase tracking-wide flex items-center gap-1
            text-zinc-500 dark:text-[#5c5c6e]
          "
        >
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
            style={{ background: languageColor }}
          />
          {languageName}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        <IconButton title={copied ? "Copied!" : "Copy"} onClick={onCopy}>
          {copied ? (
            <Check className="text-green-400" size={13} />
          ) : (
            <Copy size={13} />
          )}
        </IconButton>

        <IconButton active={running} title="Run" onClick={onRun}>
          {running ? (
            <Loader2 className="animate-spin text-blue-400" size={13} />
          ) : (
            <TerminalIcon size={13} />
          )}
        </IconButton>

        {showOutput && (
          <IconButton title="Close Output" onClick={onCloseOutput}>
            <X size={13} />
          </IconButton>
        )}

        <div className="w-px h-4 mx-1 bg-zinc-300 dark:bg-[#2a2a35]" />

        <IconButton
          title={fullScreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
          onClick={onToggleFullScreen}
        >
          {fullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </IconButton>
      </div>
    </div>
  );
}

function InnerLayout({
  children,
  fullScreen,
  showOutput,
  output,
  config,
}: {
  children: ReactElement;
  fullScreen: boolean;
  showOutput: boolean;
  output: Output;
  config:
    | (typeof supportedLanguages)[keyof typeof supportedLanguages]
    | undefined;
}) {
  const isSplit = showOutput && config?.type === "iframe";
  const hasTerminal = showOutput && config?.type !== "iframe";

  // Inject fullScreen into child
  const childWithFS = cloneElement(children, { fullScreen } as any);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Editor row — side-by-side when iframe preview */}
      <div
        className="flex flex-1 min-h-0"
        style={{ flexDirection: isSplit ? "row" : "column" }}
      >
        {/* EDITOR */}
        <div
          className="flex-1 min-h-0 overflow-hidden"
          style={{
            borderRight: isSplit ? "1px solid #1a1a22" : "none",
          }}
        >
          {childWithFS}
        </div>

        {/* LIVE PREVIEW */}
        {isSplit && (
          <div className="flex-1 min-h-0 overflow-hidden">
            <IframeHtml html={output.output} />
          </div>
        )}
      </div>

      {/* TERMINAL */}
      {hasTerminal && <Terminal output={output} />}
    </div>
  );
}

export default function WindowVSCode({ children }: WindowVSCodeProps) {
  const mounted = useMounted();

  const [copied, setCopied] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [output, setOutput] = useState<Output>({ output: "", status: "done" });
  const [showOutput, setShowOutput] = useState(false);
  const [running, setRunning] = useState(false);

  if (!children) {
    throw new Error("VScode requires a single React element as children");
  }

  const props = children.props as CodeBlockProps | CodeEditorProps;
  const language = props.language as keyof typeof supportedLanguages;
  const code = props.code;
  const config = supportedLanguages[language];

  /* ESC → exit fullscreen */
  useEffect(() => {
    if (!fullScreen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullScreen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullScreen]);

  /* Prevent body scroll in fullscreen */
  useEffect(() => {
    document.body.style.overflow = fullScreen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [fullScreen]);

  /* COPY */
  const handlerCopy = useCallback(async (value: string) => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  /* RUN */
  const runCode = async () => {
    if (!config) return;
    setRunning(true);
    setShowOutput(true);
    setOutput({ output: "", status: "running" });

    try {
      if (config.type === "iframe") {
        setOutput({ output: code, status: "done" });
      } else if (config.type === "frontend") {
        const logs: string[] = [];
        const original = console.log;

        console.log = (...args) => {
          logs.push(args.join(" "));
        };
        new Function(code)();
        console.log = original;
        setOutput({
          output: logs.join("\n") || "Executed with no output",
          status: "done",
        });
      } else if (config.type === "backend") {
        const baseUrl =
          process.env.NEXT_PUBLIC_SANDBOX_URL || "http://localhost:4000";
        const res = await fetch(`${baseUrl}/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, code }),
        });
        const data = await res.json();

        setOutput({
          output: data.stdout || data.stderr || "No output",
          status: data.stderr ? "error" : "done",
        });
      }
    } catch (e: any) {
      setOutput({ output: e.message, status: "error" });
    }

    setRunning(false);
  };

  const headerProps = {
    language: config,
    copied,
    running,
    fullScreen,
    onRun: runCode,
    showOutput,
    onCopy: () => handlerCopy(code),
    onToggleFullScreen: () => setFullScreen((p) => !p),
    onCloseOutput: () => setShowOutput(false),
  };

  /* ── FULLSCREEN via Portal ── */
  if (fullScreen && mounted) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex flex-col">
        <Header {...headerProps} />
        <InnerLayout
          fullScreen
          config={config}
          output={output}
          showOutput={showOutput}
        >
          {children}
        </InnerLayout>
      </div>,
      document.body,
    );
  }

  /* ── NORMAL ── */
  return (
    <div className="m-4 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {mounted && <Header {...headerProps} />}
      <InnerLayout
        config={config}
        fullScreen={false}
        output={output}
        showOutput={showOutput}
      >
        {children}
      </InnerLayout>
    </div>
  );
}
