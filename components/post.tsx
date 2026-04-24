import type { PostDevit } from "@/types";

import Image from "next/image";
import Link from "next/link";
import { isValidElement } from "react";
import { v4 as uuidv4 } from "uuid";

import CodeBlock from "./codeBlock";
import DevitActions from "./devitActions";

import VScode from "@/context/vscode";
import getTimeAgo from "@/lib/utils";
interface PostProps {
  post: PostDevit;
  children?: React.ReactElement<{ devit: PostDevit["devit"] }>;
}

export function Post({ post, children }: PostProps) {
  if (!post) return null;

  if (children) {
    // Validamos que sea un elemento React
    if (!isValidElement(children) || children.type !== DevitActions) {
      throw new Error("El children debe ser un DevitActions o undefined");
    }
  }

  const devitActions = children as
    | React.ReactElement<typeof DevitActions>
    | undefined;

  return (
    <article className="flex gap-8 p-7 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full">
      <Image
        alt={`Avatar de ${post.author.name}`}
        className="w-13 h-13 rounded-full object-cover shrink-0"
        height={48}
        src={post.author.avatar}
        width={48}
      />

      <div className="flex-1 flex flex-col min-w-0 max-w-xl">
        <div className="flex items-center justify-between w-full text-base">
          {/* izquierda */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-base">
              {post.author.name}
            </span>

            <Link
              className="text-zinc-500 hover:underline truncate text-sm"
              href={`/users/${post.author.id}`}
            >
              @{post.author.userName}
            </Link>
          </div>

          {/* derecha */}
          <Link
            className="text-zinc-400 hover:text-blue-500 transition-colors whitespace-nowrap text-sm"
            href={`/devits/${post.devit.id}`}
          >
            {getTimeAgo(post.devit.createdAt)}
          </Link>
        </div>

        {post.devit.code && (
          <VScode key={uuidv4()} codeSnippet={post.devit.code}>
            <CodeBlock />
          </VScode>
        )}
        <p className="mt-3 text-[17px] leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
          {post.devit.content}
        </p>

        {post.devit.imageUrl && (
          <Image
            priority
            alt={`Posted by ${post.author.name}`}
            className="mt-4 rounded-xl w-full max-h-96 object-cover"
            height={400}
            src={post.devit.imageUrl}
            width={600}
          />
        )}

        {devitActions}
      </div>
    </article>
  );
}
