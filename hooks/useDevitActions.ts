import type { Devit } from "@/types";

import { useCallback, useEffect, useRef, useState } from "react";

import { deleteDevit, likeDevit } from "@/firebase/devit";
import { useUser } from "@/hooks/useUser";

export function useDevitActions(devit: Devit) {
  const user = useUser();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(
    devit.likes?.length ?? 0,
  );
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user && devit.likes?.includes(user.id)) {
      setIsLiked(true);
    }
  }, [user, devit.likes]);

  const handlerLike = useCallback(async () => {
    if (!user) return;
    try {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      await likeDevit(devit.id);
    } catch (error) {
      console.error("Failed to like devit:", error);
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  }, [isLiked, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlerClickMenu = useCallback(() => {
    setShowMenu(true);
  }, []);

  const handlerShowCommentForm = useCallback(() => {
    setShowCommentForm((prev) => !prev);
  }, []);

  const handleDelete = useCallback(
    async (effect?: (_devitId: string) => void) => {
      setShowMenu(false);
      try {
        await deleteDevit(devit.id);
        if (effect) effect(devit.id);
      } catch (error) {
        console.error("Failed to delete devit:", error);
      }
    },
    [devit.id],
  );

  return {
    user,
    isLiked,
    likesCount,
    handlerLike,
    showCommentForm,
    handlerClickMenu,
    handlerShowCommentForm,
    showMenu,
    menuRef,
    handleDelete,
  };
}
