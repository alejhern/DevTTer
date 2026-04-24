"use client";
import type { CodeSnippet, Comment as DevitComment } from "@/types";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { CodeInput } from "./codeInput";

import { Button } from "@/components/ui/button";
import { commentOnDevit } from "@/firebase/devit";
import { useUser } from "@/hooks/useUser";

interface CommentFormProps {
  devitId: string;
  showCommentForm: boolean;
  closeForm: () => void;
}

export default function CommentForm({
  devitId,
  showCommentForm,
  closeForm,
}: CommentFormProps) {
  const user = useUser();
  const router = useRouter();

  const [comment, setComment] = useState<string>("");

  const codeSnipetRef = useRef<CodeSnippet | undefined>(undefined);

  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!comment.trim()) return;
      setIsPosting(true);
      try {
        const commentData: Omit<DevitComment, "id" | "author" | "createdAt"> = {
          comment: comment.trim(),
          code: codeSnipetRef.current,
        };

        await commentOnDevit(devitId, commentData);
        router.push(`/devits/${devitId}`);
        closeForm();
      } catch (error) {
        console.error("Error posting comment:", error);
      } finally {
        setIsPosting(false);
      }
    },
    [comment, devitId, user],
  );

  if (!user || user === undefined) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        showCommentForm ? "visible" : "invisible"
      }`}
    >
      <div className="fixed inset-0 z-[999]">
        {/* overlay */}
        <div
          className="absolute inset-0 bg-white/40 dark:bg-black/40"
          role="button"
          tabIndex={0}
          onClick={closeForm}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              closeForm();
            }
          }}
        />

        {/* panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[800px] 
          bg-white dark:bg-zinc-900
          text-gray-900 dark:text-gray-100
          p-6 shadow-xl transform transition-transform duration-300 ${
            showCommentForm ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Add Comment</h2>

            <Button
              size="icon"
              type="button"
              variant="ghost"
              onClick={closeForm}
            >
              <X size={16} />
            </Button>
          </div>
          <form
            className="
              border border-zinc-200 dark:border-zinc-800
              rounded-2xl
              p-4
              bg-white dark:bg-neutral-900
              shadow-sm
              space-y-4
            "
            onSubmit={handleSubmit}
          >
            {/* Comment */}
            <textarea
              required
              className="
              w-full
              min-h-[100px]
              text-sm
              bg-transparent
              outline-none
              resize-none
              leading-relaxed
              "
              placeholder="Write your comment..."
              value={comment}
              onChange={handleCommentChange}
            />

            {/* Code Section */}
            <div>
              <span className="text-xs text-zinc-500">Optional code</span>
              <CodeInput codeSnipetRef={codeSnipetRef} />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                color="primary"
                disabled={isPosting}
                size="sm"
                type="submit"
              >
                {isPosting ? "Posting..." : "Reply"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
