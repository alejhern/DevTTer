import type { Devit, User } from "@/types";

import Image from "next/image";
import Link from "next/link";

import CodeBlock from "./codeBlock";
import CodeUserServer from "./codeUseServer";
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
    <article className="flex gap-8 p-7 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full">
      <Image
        alt={`Avatar de ${author.name}`}
        className="w-13 h-13 rounded-full object-cover shrink-0"
        height={48}
        src={author.avatar}
        width={48}
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-xl">
        <div className="flex items-center justify-between w-full text-base">
          {/* izquierda */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-base">
              {author.name}
            </span>

            <Link
              className="text-zinc-500 hover:underline truncate text-sm"
              href={`/users/${author.id}`}
            >
              @{author.userName}
            </Link>
          </div>

          {/* derecha */}
          <Link
            className="text-zinc-400 hover:text-blue-500 transition-colors whitespace-nowrap text-sm"
            href={`/devits/${post.id}`}
          >
            {getTimeAgo(post.createdAt)}
          </Link>
        </div>

        {post.code && (
          <CodeUserServer dissableActions={dissableActions}>
            <CodeBlock code={post.code.content} language={post.code.language} />
          </CodeUserServer>
        )}
        <p className="mt-3 text-[17px] leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.imageUrl && (
          <Image
            priority
            alt={`Posted by ${author.name}`}
            className="mt-4 rounded-xl w-full max-h-96 object-cover"
            height={400}
            src={post.imageUrl}
            width={600}
          />
        )}

        {!dissableActions && <DevitActions devit={post} />}
      </div>
    </article>
  );
}
