import type { Devit, PostDevit } from "@/types";

import { DevitsDisplayer } from "@/components/devitsDisplayer";
import { Post } from "@/components/post";
import { getDevits } from "@/firebase/devits";
import { getUser } from "@/firebase/user";

export default async function Timeline() {
  const devits: Devit[] = await getDevits();

  const posts: PostDevit[] = await Promise.all(
    devits.map(async (devit) => {
      const author = await getUser(devit.author);

      return { devit, author };
    }),
  );

  return (
    <section className="bg-transparent">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Timeline
          </h1>
          <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
            See what people are sharing on Devtter.
          </p>
        </header>

        <div className="flex flex-col space-y-20">
          {devits.length === 0 ? (
            <p className="text-base text-zinc-400 text-center py-24">
              No devits yet.
            </p>
          ) : (
            <DevitsDisplayer devitsWithAuthors={posts}>
              {posts.map((post) => (
                <Post key={post.devit.id} post={post} />
              ))}
            </DevitsDisplayer>
          )}
        </div>
      </div>
    </section>
  );
}
