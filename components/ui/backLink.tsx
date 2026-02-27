"use client";

import { useRouter } from "next/navigation";

import { Button } from "./button";

export default function BackLink({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      className={className}
      type="button"
      variant="link"
      onClick={() => router.back()}
    >
      ⬅️ Back
    </Button>
  );
}
