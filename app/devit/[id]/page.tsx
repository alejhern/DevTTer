import type { Devit } from "@/types";

import { GET } from "@/app/api/devits/[id]/route";
import CodeBlock from "@/components/codeBlock";
import getTimeAgo from "@/lib/utils";
import DevitActions from "@/components/devitActions";
import BackLink from "@/components/ui/backLink";

async function fetchDevit(id: string): Promise<Devit> {
  try {
    const response = await GET({} as Request, { params: { id } });

    if (!response.ok) {
      throw new Error(`Failed to fetch devit: ${response.statusText}`);
    }

    const data = await response.json();
    const devit: Devit = {
      ...data,
      createdAt: new Date(data.createdAt),
    };

    return devit;
  } catch (error: any) {
    console.error("Error fetching devit:", error);
    throw error;
  }
}

async function fetchComments() {
  // Placeholder for fetching comments related to the devit
  return [
    {
      id: "comment1",
      author: "Alice",
      text: "This is a great devit!",
      timestamp: "2023-01-01T00:00:00Z",
    },
  ];
}
type Props = {
  params: Promise<{ id: string }>;
};

export default async function DevitPage({ params }: Props) {
  const { id } = await params;

  const devit = await fetchDevit(id);
  const comments = await fetchComments();

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
              {devit.code && (
                <CodeBlock
                  code={devit.code.content}
                  language={devit.code.language}
                />
              )}

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
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getTimeAgo(new Date(comment.timestamp))}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.text}
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
