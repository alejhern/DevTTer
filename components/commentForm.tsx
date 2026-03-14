"use client";
import type { Comment as DevitComment } from "@/types";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import CodeEditor from "@/components/codeEditor";
import CodeUser from "@/components/codeUser";
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

  const [commentData, setCommentData] = useState<
    Omit<DevitComment, "id" | "author" | "createdAt">
  >({
    comment: "",
    code: undefined,
  });

  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCommentData((prev) => ({
        ...prev,
        comment: e.target.value,
      }));
    },
    [],
  );

  const handleCodeChange = useCallback((value: string | undefined) => {
    setCommentData((prev) => ({
      ...prev,
      code: value
        ? {
            language: prev.code?.language ?? "typescript",
            content: value,
          }
        : undefined,
    }));
  }, []);

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const language = e.target.value;

      setCommentData((prev) => ({
        ...prev,
        code: {
          language,
          content: prev.code?.content ?? "",
        },
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentData.comment.trim()) return;
      setIsPosting(true);
      try {
        await commentOnDevit(devitId, commentData);
        setCommentData({
          comment: "",
          code: undefined,
        });
        router.push(`/devits/${devitId}`);
        closeForm();
      } catch (error) {
        console.error("Error posting comment:", error);
      } finally {
        setIsPosting(false);
      }
    },
    [commentData, devitId, user],
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
              value={commentData.comment}
              onChange={handleCommentChange}
            />

            {/* Code Section */}
            <div>
              <div className="flex gap-4 items-center mb-3">
                <span className="text-xs text-zinc-500">Optional code</span>

                <select
                  className="text-xs border rounded-md px-2 py-1 dark:bg-zinc-800 dark:border-zinc-700"
                  value={commentData.code?.language ?? "typescript"}
                  onChange={handleLanguageChange}
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="tsx">TSX</option>
                  <option value="python">Python</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <CodeUser>
                <CodeEditor
                  code={commentData.code?.content ?? ""}
                  language={commentData.code?.language ?? "typescript"}
                  onChange={(value) => handleCodeChange(value)}
                />
              </CodeUser>
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
