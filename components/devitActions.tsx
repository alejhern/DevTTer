import type { Devit } from "@/types";

import { MessageCircle, Heart, Repeat2, Share } from "lucide-react";

export default function DevitActions({ devit }: { devit: Devit }) {
  return (
    <div className="flex gap-6 mt-4 text-zinc-500 text-sm">
      <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition">
        <Heart size={16} />
        {devit.likes ?? 0}
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
