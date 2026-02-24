"use client";
import type { Devit, User } from "@/types";

import { useState } from "react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import AutorizePage from "@/components/autorizePage";
import { useUser } from "@/hooks/useUser";
import { postDevit } from "@/firebase/devit";

export default function ComposeDevit() {
  const user = useUser();
  const route = useRouter();

  const [devit, setDevit] = useState<Devit>({
    id: crypto.randomUUID(),
    title: "",
    content: "",
    author: user as User,
    createdAt: new Date(),
    code: undefined,
    imageUrl: "",
  });

  const [isPosting, setIsPosting] = useState(false);

  const handleChange =
    (field: keyof Devit) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDevit((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleCodeChange =
    (field: "language" | "content") =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setDevit((prev) => ({
        ...prev,
        code: {
          language: prev.code?.language ?? "typescript",
          content: prev.code?.content ?? "",
          [field]: e.target.value,
        },
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devit.title.trim() || !devit.content.trim()) return;

    setIsPosting(true);
    try {
      console.log("Posting:", devit);

      await postDevit(devit);
      console.log("Devit posted successfully");
      route.push("/timeline");
    } catch (error) {
      console.error("Error posting devit:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <AutorizePage user={user}>
      <div className="w-full">
        <form
          className="
          border border-zinc-200 dark:border-zinc-800
          rounded-2xl
          shadow-sm
          p-10
          "
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-semibold">Create new Devit</h1>

            <Button
              color="primary"
              disabled={isPosting}
              radius="full"
              size="lg"
              type="submit"
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </div>

          {/* Title */}
          <input
            className="w-full text-4xl font-bold bg-transparent outline-none mb-6"
            placeholder="Title of your devit..."
            value={devit.title}
            onChange={handleChange("title")}
          />

          {/* Content */}
          <textarea
            className="w-full min-h-[200px] text-lg bg-transparent 
          outline-none resize-none mb-8 leading-relaxed"
            placeholder="Write your thoughts..."
            value={devit.content}
            onChange={handleChange("content")}
          />

          {/* Code Section */}
          <div className="mb-8">
            <div className="flex gap-4 items-center mb-3">
              <h1 className="text-sm text-zinc-500">Code (optional)</h1>

              <select
                className="text-sm border rounded-md px-2 py-1 dark:bg-zinc-800 dark:border-zinc-700"
                value={devit.code?.language ?? "typescript"}
                onChange={handleCodeChange("language")}
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="tsx">TSX</option>
                <option value="python">Python</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
              </select>
            </div>

            <textarea
              className="w-full min-h-[180px] font-mono text-sm
            bg-zinc-100 dark:bg-zinc-900 border rounded-lg p-4 outline-none resize-none"
              placeholder="Paste your code..."
              value={devit.code?.content ?? ""}
              onChange={handleCodeChange("content")}
            />
          </div>

          {/* Image URL */}
          <input
            className="w-full border rounded-lg px-4 py-2 outline-none"
            placeholder="Image URL (optional)"
            value={devit.imageUrl ?? ""}
            onChange={handleChange("imageUrl")}
          />
        </form>
      </div>
    </AutorizePage>
  );
}
