"use client";
import { FullscreenIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import useMounted from "@/hooks/useMounted";

interface WindowVSCodeProps {
  children: React.ReactElement<{
    code: string;
    language: string;
    theme?: "light" | "dark";
  }>;
  dissableActions?: boolean;
}

function WindowVSCode({ children, dissableActions }: WindowVSCodeProps) {
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

  const props = children.props as Record<string, unknown>;
  const language = props.language as string;
  const code = props.code as string;

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
        {!dissableActions && mounted && (
          <div className="flex items-center gap-2">
            <Button
              disabled={copied}
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => handlerCopy(code)}
            >
              {copied ? "yanked!" : "yank"}
            </Button>
            <Button
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setFullScreen((prev) => !prev)}
            >
              <FullscreenIcon size={16} />
            </Button>
          </div>
        )}
      </div>
      {/* Código */}
      {cloneElement(children, {
        fullScreen: fullScreen,
      } as Record<string, unknown>)}
    </div>
  );
}

interface CodeUserProps {
  children: React.ReactElement<{
    code: string;
    language: string;
    theme?: "light" | "dark";
  }>;
  dissableActions?: boolean;
}

export default function CodeUser({
  children,
  dissableActions = false,
}: CodeUserProps) {
  const { resolvedTheme } = useTheme();

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <WindowVSCode dissableActions={dissableActions}>
      {resolvedTheme
        ? cloneElement(children, {
            theme: resolvedTheme,
          } as Record<string, unknown>)
        : children}
    </WindowVSCode>
  );
}
