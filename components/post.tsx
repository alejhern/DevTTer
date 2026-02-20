import type { DevtterPost } from "@/types";

import { Avatar } from "@heroui/react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import { MessageCircle, Heart, Repeat2, Share } from "lucide-react";

export default function Post(post: DevtterPost) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <article className="flex gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
      {/* Avatar */}
      <Avatar className="flex-shrink-0" size="lg" src={post.author.photoURL} />

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {post.author.name}
          </span>
          <span className="text-zinc-500 text-sm">@{post.author.userName}</span>
          <span className="text-zinc-400 text-sm">· 2h</span>
        </div>

        {/* Content */}
        <p className="mt-1 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Code block */}
        {post.code && (
          <div className="mt-3 rounded-xl overflow-hidden text-sm">
            <SyntaxHighlighter
              customStyle={{
                margin: 0,
                padding: "1rem",
                borderRadius: "0.75rem",
              }}
              language={post.code.language}
              style={resolvedTheme === "dark" ? oneDark : oneLight}
            >
              {post.code.content}
            </SyntaxHighlighter>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between max-w-md mt-4 text-zinc-500">
          <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
            <MessageCircle size={18} />
            <span className="text-sm">12</span>
          </button>

          <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
            <Repeat2 size={18} />
            <span className="text-sm">4</span>
          </button>

          <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
            <Heart size={18} />
            <span className="text-sm">38</span>
          </button>

          <button className="hover:text-blue-500 transition-colors">
            <Share size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
