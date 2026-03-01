"use client";
import { useTheme } from "next-themes";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useState,
} from "react";

interface CodeUserProps {
  children: React.ReactElement<{
    code: string;
    language: string;
    theme?: "light" | "dark";
  }>;
}

export default function CodeUser({ children }: CodeUserProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const handlerCopy = useCallback(async (targetValue: string) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard API not available");

      return;
    }
    await navigator.clipboard.writeText(targetValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isValidElement(children) || !resolvedTheme) {
    return null;
  }
  const props = children.props as Record<string, unknown>;
  const language = props.language as string;
  const code = props.code as string;

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

        <button
          className="text-xs px-3 py-1 rounded-md bg-zinc-200 dark:bg-zinc-700 
          hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
          type="button"
          onClick={() => handlerCopy && handlerCopy(code)}
        >
          {copied ? "yanked ✓" : "yank"}
        </button>
      </div>
      {/* Código */}
      {cloneElement(children, { theme: resolvedTheme } as Record<
        string,
        unknown
      >)}
    </div>
  );
}
