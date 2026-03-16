"use client";

import type { Devit, PostDevit, User } from "@/types";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Post } from "@/components/post";
import { useUser } from "@/hooks/useUser";

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

function Feature({ title, text, icon }: any) {
  return (
    <div
      className="
        flex flex-col items-center text-center
        p-6 rounded-xl border
        transition-all duration-300 cursor-pointer
        bg-white dark:bg-zinc-900
        border-zinc-200 dark:border-zinc-700
        hover:border-blue-500 dark:hover:border-blue-400
        hover:-translate-y-2 hover:scale-[1.02]
      "
    >
      <div className="text-3xl mb-3">{icon}</div>

      <h3 className="font-semibold text-lg mb-2 text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>

      <p className="text-zinc-600 dark:text-zinc-400 text-sm">{text}</p>
    </div>
  );
}

function ServerOnly() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6">
      {/* HERO */}
      <section className="w-full grid md:grid-cols-2 gap-16 items-center py-24">
        {/* LEFT SIDE */}
        <div className="space-y-6">
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
            <Link
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              href="/timeline"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* POST MOCKUP */}
        <div className="w-full">
          <Post post={demoDevit} />
        </div>
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
      <section className="text-center py-24">
        <h2 className="text-3xl font-bold mb-6">
          Join the global developer conversation
        </h2>
      </section>
    </main>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

export default function IndexPage() {
  const user = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ServerOnly />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6">
      {/* HERO */}
      <section className="w-full grid md:grid-cols-2 gap-16 items-center py-24">
        {/* LEFT SIDE */}
        <motion.div
          animate="visible"
          className="space-y-6"
          initial="hidden"
          variants={container}
        >
          <motion.h1
            className="text-5xl font-bold tracking-tight"
            variants={fadeUp}
          >
            Devtter
          </motion.h1>

          <motion.h2 className="text-xl text-zinc-500" variants={fadeUp}>
            The social network for developers
          </motion.h2>

          <motion.p
            className="text-zinc-600 dark:text-zinc-400 max-w-md"
            variants={fadeUp}
          >
            Devtter is the social network designed for developers. Share ideas,
            code snippets, projects, and discoveries. Collaborate, learn, and
            showcase your work—all in one place.
          </motion.p>

          <motion.div className="flex gap-4 pt-4" variants={fadeUp}>
            {!user && (
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-semibold"
                  href={getStart}
                >
                  Join Devtter
                </Link>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <Link
                className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                href="/timeline"
              >
                Explore
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* POST MOCKUP */}
        <motion.div
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="w-full"
          initial={{ opacity: 0, x: 120, scale: 0.9 }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.4,
          }}
        >
          <Post post={demoDevit} />
        </motion.div>
      </section>

      {/* FEATURES */}
      <motion.section
        className="max-w-8xl w-full py-20 grid md:grid-cols-3 gap-10"
        initial={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        variants={container}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
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
      </motion.section>

      {/* CTA */}
      <motion.section
        className="text-center py-24"
        initial={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-6">
          Join the global developer conversation
        </h2>
      </motion.section>
    </main>
  );
}
