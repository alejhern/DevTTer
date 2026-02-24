import type { Devit } from "@/types";

import Post from "@/components/post";
import { GET } from "@/app/api/devits/route";

async function getDevitsFromServer(): Promise<Devit[]> {
  try {
    const response = await GET();

    if (!response.ok) {
      throw new Error("Failed to fetch devits");
    }

    return response.json();
  } catch (error: any) {
    console.error("Error fetching devits:", error);

    return [];
  }
}

export default async function Timeline() {
  const devits: Devit[] = await getDevitsFromServer();

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
            devits.map((devit) => (
              <div
                key={devit.id}
                className="text-lg md:text-xl leading-relaxed transition-opacity hover:opacity-90"
              >
                <Post {...devit} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
