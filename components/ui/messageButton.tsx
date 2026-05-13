"use client";
import { MessageCircleCodeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "./button";

import { useUser } from "@/hooks/useUser";

export default function MessageButton({ idUser }: { idUser: string }) {
  const user = useUser();
  const router = useRouter();

  if (!user || user.id === idUser) return null;

  return (
    <Button
      className="flex items-center gap-3 px-3 py-2 text-base font-medium hover:underline"
      variant="link"
      onClick={() => router.push(`/messenger/${idUser}`)}
    >
      <MessageCircleCodeIcon className="h-5 w-5" />
      <span>Message</span>
    </Button>
  );
}
