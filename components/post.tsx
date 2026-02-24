"use client";
import type { Devit } from "@/types";

import { Avatar } from "@heroui/react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useCallback, useEffect, useState } from "react";
import {
  MessageCircle,
  Heart,
  Repeat2,
  Share,
  Clipboard,
  Check,
} from "lucide-react";

export default function Post(post: Devit) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!post.code?.content) return;

    try {
      await navigator.clipboard.writeText(post.code.content);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  if (!mounted) return null;

  return (
    <article
      className="
        flex gap-4 p-5
        bg-zinc-50 dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-xl
        transition-colors
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        w-full
      "
    >
      <Avatar className="w-10 h-10 flex-shrink-0" src={post.author.avatar} />

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {post.author.name}
          </span>
          <span className="text-zinc-500">@{post.author.userName}</span>
          <span className="text-zinc-400">· 2h</span>
        </div>

        {/* Content */}
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Code Block */}
        {post.code && (
          <div className="relative mt-4 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden group">
            <button
              className="absolute top-2 right-2 z-10 p-1.5 rounded-md
              bg-zinc-200 dark:bg-zinc-700
              hover:bg-zinc-300 dark:hover:bg-zinc-600
              transition"
              onClick={handleCopy}
            >
              {copied ? <Check size={14} /> : <Clipboard size={14} />}
            </button>

            <SyntaxHighlighter
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.85rem",
                background: resolvedTheme === "dark" ? "#0d1117" : "#f6f8fa",
              }}
              language={post.code.language}
              style={resolvedTheme === "dark" ? oneDark : oneLight}
            >
              {post.code.content}
            </SyntaxHighlighter>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-6 mt-4 text-zinc-500 text-sm">
          <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            <MessageCircle size={16} />
            12
          </button>

          <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            <Repeat2 size={16} />4
          </button>

          <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            <Heart size={16} />
            38
          </button>

          <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">
            <Share size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
