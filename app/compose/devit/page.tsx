"use client";
import { Button } from "@heroui/button";

import AutorizePage from "@/components/autorizePage";
import { useUser } from "@/hooks/useUser";
import { useComposeDevit } from "@/hooks/useComposeDevit";
import DragAndDropFile from "@/components/dragAndDropFile";

export default function ComposeDevit() {
  const user = useUser();
  const {
    devit,
    handleChange,
    handleCodeChange,
    handleSubmit,
    file,
    handlerOnchangeFile,
    isPosting,
  } = useComposeDevit(user);

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

          {/* Image Upload */}
          <DragAndDropFile file={file} handlerOnchange={handlerOnchangeFile} />
        </form>
      </div>
    </AutorizePage>
  );
}
