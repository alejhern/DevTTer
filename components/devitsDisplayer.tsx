"use client";

import type { PostDevit, User } from "@/types";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import DevitActions from "./devitActions";
import { Post } from "./post";
import { Loading } from "./ui/loading";

import { getDevits, getUserDevits } from "@/firebase/devits";
import { getUser } from "@/firebase/user";
import useMounted from "@/hooks/useMounted";

interface DevitsDisplayerProps {
  devitsWithAuthors: PostDevit[];
  children: React.ReactNode;
  user?: User;
}

export function DevitsDisplayer({
  devitsWithAuthors,
  children,
  user,
}: DevitsDisplayerProps) {
  const isMounted = useMounted();
  const shouldReduceMotion = useReducedMotion();
  const [devits, setDevits] = useState<PostDevit[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    setDevits(devitsWithAuthors);
  }, [devitsWithAuthors]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      const reachedTop =
        currentScroll === 0 && lastScrollY.current > currentScroll;

      if (reachedTop && !isUpdating) {
        updateDevits();
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isUpdating]);

  const updateDevits = async () => {
    setIsUpdating(true);

    try {
      const newDevits = user ? await getUserDevits(user.id) : await getDevits();

      const posts: PostDevit[] = user
        ? newDevits.map((devit) => ({ devit, author: user }))
        : await Promise.all(
            newDevits.map(async (devit) => {
              const author = await getUser(devit.author);

              return { devit, author };
            }),
          );

      setDevits(posts);
    } catch (error) {
      console.error("Failed to update devits:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const devitRemovedEffect = (id: string) => {
    setDevits((prev) => prev.filter((post) => post.devit.id !== id));
  };

  if (!isMounted || shouldReduceMotion) return children;

  if (devits.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-base text-zinc-400">No devits yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {isUpdating && <Loading />}

      <AnimatePresence>
        {devits.map((post) => (
          <motion.div
            key={post.devit.id}
            layout
            exit={{ opacity: 0, x: 120 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            viewport={{ margin: "-120px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Post post={post}>
              <DevitActions
                devit={post.devit}
                handleDeleteEffect={devitRemovedEffect}
              />
            </Post>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
