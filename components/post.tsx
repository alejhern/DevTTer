import type { Devit } from "@/types";

import NextLink from "next/link";

import CodeBlock from "./codeBlock";
import DevitActions from "./devitActions";

import getTimeAgo from "@/lib/utils";

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
          <span className="text-zinc-400">
            <NextLink className="hover:underline" href={`/devit/${post.id}`}>
              {getTimeAgo(post.createdAt)}
            </NextLink>
          </span>
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

        <CodeBlock code={post.code.content} language={post.code.language} />

        <DevitActions devit={post} />
      </div>
    </article>
  );
}
