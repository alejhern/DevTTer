import {
  Check,
  Copy,
  Loader2,
  Maximize2,
  Minimize2,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import { memo, useCallback, useEffect, useRef } from "react";

import { useVSCode } from "@/context/vscode";
import { useMounted } from "@/hooks/useMounted";

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
      className="
        flex items-center justify-center w-7 h-7 rounded
        transition-colors duration-150
        text-[#4a4a5a] hover:text-[#c8c8d8] hover:bg-[#1e1e28]
        dark:text-[#b0b0b8] dark:hover:text-[#1a1a1a]
        dark:hover:bg-[#e7e7ef]
      "
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

const Header = memo(function Header() {
  const { state, actions, config, codeSnippet } = useVSCode();
  const mounted = useMounted();

  const onRun = useCallback(() => {
    actions.run();
  }, [actions]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet.content);

    if (timerRef.current) clearTimeout(timerRef.current);

    actions.dispatch({ type: "COPY_START" });

    timerRef.current = setTimeout(() => {
      actions.dispatch({ type: "COPY_RESET" });
    }, 1500);
  }, [codeSnippet.content, actions]);

  const onToggleFullScreen = useCallback(() => {
    actions.dispatch({ type: "FULLSCREEN_TOGGLE" });
  }, [actions]);

  const onCloseOutput = useCallback(() => {
    actions.dispatch({ type: "OUTPUT_CLOSE" });
  }, [actions]);

  const languageName = config?.name ?? "Unknown";
  const languageColor = config?.color ?? "#5c5c6e";

  return (
    <div className="flex items-center justify-between px-4 py-2 flex-shrink-0 bg-zinc-100 dark:bg-[#111114] border-b border-zinc-200 dark:border-[#1e1e24]">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />

        <span className="ml-3 text-sm font-medium uppercase tracking-wide flex items-center gap-1 text-zinc-500 dark:text-[#5c5c6e]">
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ background: languageColor }}
          />
          {languageName}
        </span>
      </div>

      {/* RIGHT */}
      {mounted && (
        <div className="flex items-center gap-1">
          <IconButton
            title={state.copied ? "Copied!" : "Copy"}
            onClick={onCopy}
          >
            {state.copied ? <Check size={15} /> : <Copy size={13} />}
          </IconButton>

          <IconButton
            active={state.status === "running"}
            title="Run"
            onClick={onRun}
          >
            {state.status === "running" ? (
              <Loader2 className="animate-spin text-blue-400" size={13} />
            ) : (
              <TerminalIcon size={13} />
            )}
          </IconButton>

          {state.showOutput && (
            <IconButton title="Close Output" onClick={onCloseOutput}>
              <X size={13} />
            </IconButton>
          )}

          <div className="w-px h-4 mx-1 bg-zinc-300 dark:bg-[#2a2a35]" />

          <IconButton
            title={state.fullScreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={onToggleFullScreen}
          >
            {state.fullScreen ? (
              <Minimize2 size={13} />
            ) : (
              <Maximize2 size={13} />
            )}
          </IconButton>
        </div>
      )}
    </div>
  );
});

function Terminal({ output }: { output: string }) {
  return (
    <div className="font-mono text-sm flex flex-col border-t bg-[#0d0d0f] text-[#c8c8d4] border-[#1e1e24]">
      <div className="px-4 py-2 border-b bg-[#111114] text-xs text-[#5c5c6e]">
        output
      </div>
      <div className="p-4 whitespace-pre-wrap">{output}</div>
    </div>
  );
}

function IframeHtml({ html }: { html: string }) {
  return (
    <iframe
      className="w-full h-full"
      sandbox="allow-scripts"
      srcDoc={html}
      title="Output"
    />
  );
}

export function InnerLayout({ children }: { children: React.ReactElement }) {
  const { state, config } = useVSCode();

  const isSplit = state.showOutput && config?.type === "iframe";
  const hasTerminal = state.showOutput && config?.type !== "iframe";

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div
        className="flex flex-1 min-h-0"
        style={{ flexDirection: isSplit ? "row" : "column" }}
      >
        <div
          className="flex-1 min-h-0 overflow-hidden"
          style={{
            borderRight: isSplit ? "1px solid #1a1a22" : "none",
          }}
        >
          {children}
        </div>

        {isSplit && (
          <div className="flex-1 min-h-0 overflow-hidden">
            <IframeHtml html={state.output} />
          </div>
        )}
      </div>

      {hasTerminal && <Terminal output={state.output} />}
    </div>
  );
}

const VscodeLayout = memo(function VscodeLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const { state } = useVSCode();

  // 🔥 bloquear scroll
  useEffect(() => {
    document.body.style.overflow = state.fullScreen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [state.fullScreen]);

  // 🔥 FULLSCREEN (PORTAL)
  if (state.fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col bg-white dark:bg-[#111114]">
        <Header />
        <InnerLayout>{children}</InnerLayout>
      </div>
    );
  }

  // 🔥 NORMAL
  return (
    <div className="m-4 rounded-xl overflow-hidden shadow-lg flex flex-col">
      <Header />
      <InnerLayout>{children}</InnerLayout>
    </div>
  );
});

export default VscodeLayout;
