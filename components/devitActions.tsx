"use client";
import type { Devit } from "@/types";

import { createPortal } from "react-dom";
import { useState, useEffect, useCallback } from "react";
import { MessageCircle, Heart, Repeat2, Share } from "lucide-react";

import { useUser } from "@/hooks/useUser";
import { likeDevit } from "@/firebase/devit";
import { Button } from "@/components/ui/button";
import CommentForm from "@/components/commentForm";

export default function DevitActions({ devit }: { devit: Devit }) {
  const user = useUser();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(
    devit.likes?.length ?? 0,
  );
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

  useEffect(() => {
    if (user && devit.likes?.includes(user.id)) {
      setIsLiked(true);
    }
  }, [user, devit.likes]);

  const handlerLike = useCallback(async () => {
    if (!user) return;
    try {
      await likeDevit(devit.id);
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Failed to like devit:", error);
      setIsLiked((prev) => !prev); // Revert like state on error
    }
  }, [isLiked, user]);

  return (
    <>
      <div className="flex gap-6 mt-4 text-zinc-500 text-sm">
        <Button size="icon" type="button" variant="ghost" onClick={handlerLike}>
          <Heart fill={isLiked ? "red" : "none"} size={16} />
          {likesCount}
        </Button>

        <Button
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => setShowCommentForm(true)}
        >
          <MessageCircle size={16} />
          {Array.isArray(devit.comments)
            ? devit.comments.length
            : Number(devit.comments ?? 0)}
        </Button>

        <Button size="icon" type="button" variant="ghost">
          <Repeat2 size={16} />
          {devit.reDevs ?? 0}
        </Button>

        <Button size="icon" type="button" variant="ghost">
          <Share size={16} />
        </Button>
      </div>
      {showCommentForm &&
        user &&
        createPortal(
          <CommentForm
            closeForm={() => setShowCommentForm(false)}
            devitId={devit.id}
            showCommentForm={showCommentForm}
          />,
          document.body,
        )}
    </>
  );
}
