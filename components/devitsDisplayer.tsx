"use client";

import type { PostDevit } from "@/types";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import DevitActions from "./devitActions";
import { Post } from "./post";
import { Loading } from "./ui/loading";

import { getDevits } from "@/firebase/devits";
import { getUser } from "@/firebase/user";
import useMounted from "@/hooks/useMounted";

interface DevitsDisplayerProps {
  devitsWithAuthors: PostDevit[];
  children: React.ReactNode;
}

export function DevitsDisplayer({
  devitsWithAuthors,
  children,
}: DevitsDisplayerProps) {
  const mounted = useMounted();
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
      const newDevits = await getDevits();

      const posts: PostDevit[] = await Promise.all(
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

  if (!mounted) return children;

  return (
    <div className="flex flex-col gap-4">
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
