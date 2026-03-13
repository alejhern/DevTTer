import type { Devit, User } from "@/types";

import NextLink from "next/link";
import Image from "next/image";

import CodeUserServer from "./codeUseServer";
import CodeBlock from "./codeBlock";
import DevitActions from "./devitActions";

import getTimeAgo from "@/lib/utils";

interface PostProps {
  post: Devit;
  author: User;
  dissableActions?: boolean;
}

export function Post({ post, author, dissableActions = false }: PostProps) {
  if (!post) return null;

  return (
    <article className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full">
      <Image
        alt={`Avatar de ${author.name}`}
        className="w-12 h-12 rounded-full object-cover shrink-0"
        height={48}
        src={author.avatar}
        width={48}
      />

      <div className="flex-1">
        <div className="flex justify-between gap-4 text-sm">
          <div className="flex gap-4">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {author.name}
            </span>

            <span className="text-zinc-500">@{author.userName}</span>
          </div>

          <span className="text-zinc-400">
            <NextLink className="hover:underline" href={`/devits/${post.id}`}>
              {getTimeAgo(post.createdAt)}
            </NextLink>
          </span>
        </div>

        <p className="mt-2 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.imageUrl && (
          <Image
            priority
            alt={`Posted by ${author.name}`}
            className="mt-4 rounded-lg w-full max-h-96 object-cover"
            height={400}
            src={post.imageUrl}
            width={600}
          />
        )}

        {post.code && (
          <CodeUserServer dissableActions={dissableActions}>
            <CodeBlock code={post.code.content} language={post.code.language} />
          </CodeUserServer>
        )}

        {!dissableActions && <DevitActions devit={post} />}
      </div>
    </article>
  );
}
