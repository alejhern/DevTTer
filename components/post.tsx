import type { Devit } from "@/types";

import { MessageCircle, Heart, Repeat2, Share } from "lucide-react";

import CodeBlock from "./codeBlock";

const getTimeAgo = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}sec`;
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}hours`;

  const days = Math.floor(hours / 24);

  return `${days}days`;
};

function PostActions({ post }: { post: Devit }) {
  return (
    <div className="flex gap-6 mt-4 text-zinc-500 text-sm">
      <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
        <Heart size={16} />
        {post.likes ?? 0}
      </button>

      <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
        <MessageCircle size={16} />
        {post.comments ?? 0}
      </button>

      <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
        <Repeat2 size={16} />
        {post.reDevs ?? 0}
      </button>

      <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">
        <Share size={16} />
      </button>
    </div>
  );
}

export function Post({ post }: { post: Devit }) {
  if (!post) return null;

  return (
    <article className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full">
      <img
        alt={`Avatar de ${post?.author?.name ?? "usuario"}`}
        className="w-10 h-10 rounded-full object-cover"
        src={post.author.avatar || "/default-avatar.png"}
      />
      <div className="flex-1">
        <div className="flex justify-between gap-4 text-sm">
          <div className="flex gap-4">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {post.author.name}
            </span>
            <span className="text-zinc-500">@{post.author.userName}</span>
          </div>
          <span className="text-zinc-400">{getTimeAgo(post.createdAt)}</span>
        </div>

        <p className="mt-2 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.imageUrl && (
          <img
            alt={`Posted by ${post.author.name}`}
            className="mt-4 rounded-lg w-full max-h-96 object-cover"
            src={post.imageUrl}
          />
        )}

        {post.code && (
          <CodeBlock code={post.code.content} language={post.code.language} />
        )}

        <PostActions post={post} />
      </div>
    </article>
  );
}
