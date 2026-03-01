"use client";
import type { Devit } from "@/types";

import { useState, useEffect } from "react";
import { MessageCircle, Heart, Repeat2, Share } from "lucide-react";

import { useUser } from "@/hooks/useUser";
import { likeDevit } from "@/firebase/devit";

export default function DevitActions({ devit }: { devit: Devit }) {
  const user = useUser();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(
    devit.likes?.length ?? 0,
  );

  useEffect(() => {
    if (user && devit.likes?.includes(user.id)) {
      setIsLiked(true);
    }
  }, [user, devit.likes]);

  const handlerLike = async () => {
    if (!user) return;
    try {
      await likeDevit(devit.id);
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Failed to like devit:", error);
      setIsLiked((prev) => !prev); // Revert like state on error
    }
  };

  return (
    <div className="flex gap-6 mt-4 text-zinc-500 text-sm">
      <button
        className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
        onClick={handlerLike}
      >
        <Heart fill={isLiked ? "red" : "none"} size={16} />
        {likesCount}
      </button>

      <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
        <MessageCircle size={16} />
        {devit.comments ?? 0}
      </button>

      <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
        <Repeat2 size={16} />
        {devit.reDevs ?? 0}
      </button>

      <button className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">
        <Share size={16} />
      </button>
    </div>
  );
}
