import type { Comment, User } from "@/types";

import { memo } from "react";

import CodeBlock from "./codeBlock";

import VScode from "@/context/vscode";
import getTimeAgo from "@/lib/utils";

export const CommentItem = memo(function CommentItem({
  comment,
  author,
}: {
  comment: Comment;
  author: User;
}) {
  return (
    <div className="flex gap-3 mt-4">
      {/* Avatar */}
      <img
        alt={`${author.userName}'s avatar`}
        className="w-10 h-10 rounded-full object-cover"
        loading="lazy"
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
        {comment.code && (
          <VScode codeSnippet={comment.code}>
            <CodeBlock />
          </VScode>
        )}
      </div>
    </div>
  );
});
