import type { CodeSnippet, Comment, User } from "@/types";

import CodeBlock from "./codeBlock";
import CodeUser from "./codeUser";

import getTimeAgo from "@/lib/utils";

export function CommentItem({
  comment,
  author,
}: {
  comment: Comment;
  author: User;
}) {
  const code: CodeSnippet | undefined = comment.code as CodeSnippet | undefined;

  return (
    <div className="flex gap-3 mt-4">
      {/* Avatar */}
      <img
        alt={`${author.userName}'s avatar`}
        className="w-10 h-10 rounded-full object-cover"
        src={author.avatar}
      />

      {/* Content */}
      <div className="flex flex-col w-full gap-1">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">@{author.userName}</p>

          <span className="text-xs text-zinc-500">
            {getTimeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Comment */}
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          {comment.comment}
        </p>

        {/* Code */}
        {code && (
          <CodeUser>
            <CodeBlock code={code.content} language={code.language} />
          </CodeUser>
        )}
      </div>
    </div>
  );
}
