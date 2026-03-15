"use client";
import type { Devit } from "@/types";

import {
  Edit,
  MessageCircle,
  MoreVertical,
  Repeat2,
  Share,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";

import CommentForm from "@/components/commentForm";
import { Button } from "@/components/ui/button";
import { useDevitActions } from "@/hooks/useDevitActions";

export default function DevitActions({
  devit,
  handleDeleteEffect,
}: {
  devit: Devit;
  handleDeleteEffect?: (_devitId: string) => void;
}) {
  const {
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
  } = useDevitActions(devit);

  if (!user) return null;

  return (
    <>
      <div className="flex justify-between items-center mt-4 text-sm text-zinc-500">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            className="flex items-center gap-2 hover:text-yellow-500"
            size="sm"
            type="button"
            variant="ghost"
            onClick={handlerLike}
          >
            <Star
              className="transition"
              fill={isLiked ? "currentColor" : "none"}
              size={18}
            />
            {likesCount}
          </Button>

          <Button
            className="flex items-center gap-2 hover:text-blue-500"
            size="sm"
            type="button"
            variant="ghost"
            onClick={handlerShowCommentForm}
          >
            <MessageCircle size={18} />
            {Array.isArray(devit.comments)
              ? devit.comments.length
              : Number(devit.comments ?? 0)}
          </Button>

          <Button
            className="flex items-center gap-2 hover:text-green-500"
            size="sm"
            type="button"
            variant="ghost"
          >
            <Repeat2 size={18} />
            {devit.reDevs ?? 0}
          </Button>

          <Button
            className="hover:text-blue-500"
            size="icon"
            type="button"
            variant="ghost"
          >
            <Share size={18} />
          </Button>
        </div>

        {/* Dropdown */}
        {user.id === devit.author && (
          <div ref={menuRef} className="relative">
            <Button
              className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              size="icon"
              type="button"
              variant="ghost"
              onClick={handlerClickMenu}
            >
              <MoreVertical size={18} />
            </Button>

            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-36 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 backdrop-blur shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                <Link
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  href={`/compose/devit?edit=${devit.id}`}
                >
                  <Edit size={16} />
                  Editar
                </Link>

                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  type="button"
                  onClick={() => handleDelete(handleDeleteEffect)}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showCommentForm &&
        user &&
        createPortal(
          <CommentForm
            closeForm={handlerShowCommentForm}
            devitId={devit.id}
            showCommentForm={showCommentForm}
          />,
          document.body,
        )}
    </>
  );
}
