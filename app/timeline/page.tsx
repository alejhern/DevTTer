import DevitActions from "@/components/devitActions";
import { DevitsDisplayer } from "@/components/devitsDisplayer";
import { Post } from "@/components/post";
import { getDevits } from "@/firebase/devits";
import { getUsersByIds } from "@/services/user";
import { UKNOWN_USER, type Devit, type PostDevit } from "@/types";

export default async function Timeline() {
  const devits: Devit[] = await getDevits();

  const authorsIds = Array.from(new Set(devits.map((d) => d.author)));

  const authors = await getUsersByIds(authorsIds);

  const posts: PostDevit[] = devits.map((devit) => {
    const author = authors ? authors.find((a) => a.id === devit.author) : null;

    return {
      devit,
      author: author || UKNOWN_USER,
    };
  });

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

        <DevitsDisplayer devitsWithAuthors={posts}>
          <div className="flex flex-col gap-10">
            {devits.length === 0 ? (
              <p className="text-base text-zinc-400 text-center py-24">
                No devits yet.
              </p>
            ) : (
              posts.map((post) => (
                <Post key={post.devit.id} post={post}>
                  <DevitActions devit={post.devit} />
                </Post>
              ))
            )}
          </div>
        </DevitsDisplayer>
      </div>
    </section>
  );
}
