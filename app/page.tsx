"use client";

import type { Devit, PostDevit, User } from "@/types";

import Link from "next/link";

import Animated from "@/components/animationMotion";
import { Post } from "@/components/post";
import { useUser } from "@/hooks/useUser";

// --- Mock data ---
const mockUser: User = {
  id: "1",
  name: "Alejandro Dev",
  userName: "alejandrodev",
  email: "",
  avatar:
    "https://cdn.intra.42.fr/users/5a9663269348380a099b9a1c13cad54f/alejhern.png",
};

const mockPost: Devit = {
  id: "demo-devit",
  content:
    "🚀 Just launched Devtter!\n\nA social network built for developers to share ideas, code snippets and projects.\n\nBuilt with Next.js + Firebase.",
  createdAt: new Date("2026-01-01"),
  author: "1",
  code: {
    content: `const devit = "Hello Devtter 🚀"`,
    language: "javascript",
  },
};

const demoDevit: PostDevit = {
  devit: mockPost,
  author: mockUser,
};

const clientId = process.env.NEXT_PUBLIC_FT_CLIENT_ID;
const redirectUri = `${process.env.NEXT_PUBLIC_FT_PUBLIC_APP_URL}${process.env.NEXT_PUBLIC_FT_REDIRECT_URI}`;
const getStart =
  `https://api.intra.42.fr/oauth/authorize?` +
  `client_id=${clientId}` +
  `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  `&response_type=code&scope=public`;

// ---------------- Feature component ----------------
function Feature({ title, text, icon }: any) {
  return (
    <Animated
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-semibold text-lg mb-2 text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">{text}</p>
      </div>
    </Animated>
  );
}

// ---------------- Página principal ----------------
export default function IndexPage() {
  const user = useUser();

  return (
    <main className="min-h-screen flex flex-col items-center px-6">
      {/* HERO */}
      <section className="w-full grid md:grid-cols-2 gap-16 items-center py-24">
        {/* LEFT SIDE */}
        <Animated
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold tracking-tight">Devtter</h1>
          <h2 className="text-xl text-zinc-500">
            The social network for developers
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
            Devtter is the social network designed for developers. Share ideas,
            code snippets, projects, and discoveries. Collaborate, learn, and
            showcase your work—all in one place.
          </p>
          <div className="flex gap-4 pt-4">
            {!user && (
              <a
                className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-semibold"
                href={getStart}
              >
                Join Devtter
              </a>
            )}
            <Link
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl"
              href="/timeline"
            >
              Explore
            </Link>
          </div>
        </Animated>

        {/* POST MOCKUP */}
        <Animated
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="w-full"
          initial={{ opacity: 0, x: 120, scale: 0.9 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <Post post={demoDevit} />
        </Animated>
      </section>

      {/* FEATURES */}
      <section className="max-w-8xl w-full py-20 grid md:grid-cols-3 gap-10">
        <Feature
          icon="💬"
          text="Post short updates, thoughts, and insights about your coding journey. Keep your community in the loop instantly."
          title="Share Devits"
        />
        <Feature
          icon="💻"
          text="Embed code snippets directly in your posts with syntax highlighting for easy sharing and readability."
          title="Code Friendly"
        />
        <Feature
          icon="🌍"
          text="Connect with developers worldwide. Discover projects, collaborate, and join meaningful conversations."
          title="Developer Community"
        />
      </section>

      {/* CTA */}
      <Animated
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-24"
        initial={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl font-bold mb-6">
          Join the global developer conversation
        </h2>
      </Animated>
    </main>
  );
}
