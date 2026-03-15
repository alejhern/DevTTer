"use client";

import type { PostDevit } from "@/types";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Post } from "./post";
import { Loading } from "./ui/loading";

import { getDevits } from "@/firebase/devits";
import { getUser } from "@/firebase/user";

interface DevitsDisplayerProps {
  devitsWithAuthors: PostDevit[];
  children: React.ReactNode;
}

export function DevitsDisplayer({
  devitsWithAuthors,
  children,
}: DevitsDisplayerProps) {
  const [mounted, setMounted] = useState(false);
  const [devits, setDevits] = useState<PostDevit[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return children;

  return (
    <div className="flex flex-col gap-4">
      {isUpdating && <Loading />}

      {devits.map((post) => (
        <motion.div
          key={post.devit.id}
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Post post={post} />
        </motion.div>
      ))}
    </div>
  );
}
