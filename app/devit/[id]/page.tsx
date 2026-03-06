import type { Devit, Comment } from "@/types";

import getTimeAgo from "@/lib/utils";
import DevitActions from "@/components/devitActions";
import BackLink from "@/components/ui/backLink";
import CodeUserServer from "@/components/codeUseServer";
import CodeBlock from "@/components/codeBlock";

async function fetchDevit(id: string): Promise<Devit> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/devits/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch devit: ${response.statusText}`);
    }

    const data = await response.json();
    const comments: Array<Comment> = Array.isArray(data.comments)
      ? data.comments.map((comment: Comment) => ({
          id: comment.id,
          comment: comment.comment,
          user: comment.user,
          createdAt: new Date(comment.createdAt),
        }))
      : [];

    const devit: Devit = {
      ...data,
      comments,
      createdAt: new Date(data.createdAt),
    };

    return devit;
  } catch (error: any) {
    console.error("Error fetching devit:", error);
    throw error;
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DevitPage({ params }: Props) {
  const { id } = await params;

  const devit = await fetchDevit(id);
  const comments = Array.isArray(devit.comments) ? devit.comments : [];

  return (
    <>
      <BackLink className="text-sm text-gray-500 dark:text-gray-400 mb-4 inline-block" />
      <div className="h-full bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors rounded-2xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row rounded-2xl overflow-hidden">
          {/* LEFT - Devit */}
          <main className="flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 p-6 sm:p-10">
            <article className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                {devit.author && (
                  <img
                    alt={devit.author.name}
                    className="rounded-full"
                    height={48}
                    src={devit.author.avatar}
                    width={48}
                  />
                )}

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-lg">{devit.author.name}</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      @{devit.author.userName}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getTimeAgo(devit.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-xl leading-relaxed whitespace-pre-wrap">
                {devit.content}
              </p>

              {/* Code */}
              <CodeUserServer>
                <CodeBlock
                  code={devit.code.content}
                  language={devit.code.language}
                />
              </CodeUserServer>

              {/* Image */}
              {devit.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <img
                    alt={`devit img posted by ${devit.author.name}`}
                    className="w-full object-cover"
                    src={devit.imageUrl}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <DevitActions devit={devit} />
              </div>
            </article>
          </main>

          {/* RIGHT - Comments */}
          <aside className="w-full lg:w-[420px] bg-gray-50 dark:bg-neutral-950 p-6 sm:p-8 overflow-y-auto rounded-r-2xl">
            <h3 className="text-lg font-bold mb-6">
              Comments ({comments.length})
            </h3>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{comment.user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getTimeAgo(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
