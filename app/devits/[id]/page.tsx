import Image from "next/image";

import getTimeAgo from "@/lib/utils";
import DevitActions from "@/components/devitActions";
import BackLink from "@/components/ui/backLink";
import CodeUserServer from "@/components/codeUseServer";
import CodeBlock from "@/components/codeBlock";
import { CommentItem } from "@/components/comment";
import { fetchDevit } from "@/firebase/devit";
import { getUser } from "@/firebase/user";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DevitPage({ params }: Props) {
  const { id } = await params;

  const devit = await fetchDevit(id);
  const author = await getUser(devit.author);
  const comments = await Promise.all(
    devit.comments && Array.isArray(devit.comments)
      ? devit.comments.map(async (comment) => {
          const commentAuthor = await getUser(comment.author);

          return { comment, author: commentAuthor };
        })
      : [],
  );

  return (
    <>
      <BackLink className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 inline-block" />

      <div className="min-h-full bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 rounded-2xl transition-colors">
        <div className="mx-auto flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT - Devit */}
          <main className="flex-1 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 lg:p-10">
            <article className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                {author && (
                  <Image
                    alt={author.name}
                    className="rounded-full size-12 object-cover"
                    height={48}
                    src={author.avatar}
                    width={48}
                  />
                )}

                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-lg">{author.name}</h2>

                    <span className="text-sm text-zinc-500">
                      @{author.userName}
                    </span>

                    <span className="text-zinc-400">·</span>

                    <span className="text-sm text-zinc-500">
                      {getTimeAgo(devit.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
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
                <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <Image
                    alt={`devit img posted by ${author.name}`}
                    className="w-full object-cover"
                    height={400}
                    src={devit.imageUrl}
                    width={600}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <DevitActions devit={devit} />
              </div>
            </article>
          </main>

          {/* RIGHT - Comments */}
          <aside
            className="
            w-full
            lg:basis-[40%]
            lg:max-w-lg
            bg-zinc-50 dark:bg-neutral-950
            p-6 sm:p-8
            overflow-y-auto
          "
          >
            <h3 className="text-lg font-semibold mb-6">
              Comments ({comments.length})
            </h3>

            <div className="flex flex-col gap-4">
              {comments.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-12">
                  No comments yet.
                </p>
              ) : (
                comments.map(({ comment, author }) => (
                  <CommentItem
                    key={comment.id}
                    author={author}
                    comment={comment}
                  />
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
