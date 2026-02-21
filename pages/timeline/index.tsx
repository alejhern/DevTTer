import type { Devit } from "@/types";

import { useEffect, useState } from "react";

import Post from "@/components/post";
import { getDevits } from "@/firebase/devits";

export default function Timeline() {
  const [devits, setDevits] = useState<Devit[]>([]);

  useEffect(() => {
    getDevits()
      .then(setDevits)
      .catch((error) => console.error("Error fetching devits:", error));
  }, []);

  return (
    <section className="bg-transparent">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header centrado */}
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Timeline
          </h1>
          <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
            See what people are sharing on Devtter.
          </p>
        </header>

        {/* Feed más grande y alargado */}
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
