"use client";

import { Button } from "@heroui/button";

import { CodeInput } from "./codeInput";
import DragAndDropFile from "./dragAndDropFile";

import { useComposeDevit } from "@/hooks/useComposeDevit";

export function DevitForm({ idDevit }: { idDevit?: string }) {
  const {
    content,
    handleContentChange,
    handleSubmit,
    fileRef,
    isPosting,
    codeSnippetRef,
    initialCode,
    initialFile,
  } = useComposeDevit(idDevit);

  return (
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
        <h1 className="text-2xl font-semibold">
          {idDevit ? "Edit Devit" : "Create new Devit"}
        </h1>

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

      {/* Content */}
      <textarea
        className="w-full min-h-[200px] text-lg bg-transparent outline-none resize-none mb-8 leading-relaxed"
        placeholder="Write your thoughts..."
        value={content}
        onChange={handleContentChange}
      />

      {/* Code Section */}
      <div className="mb-8">
        <h1 className="text-sm text-zinc-500">Code</h1>
        <CodeInput codeSnipetRef={codeSnippetRef} initialCode={initialCode} />
      </div>

      {/* Image Upload */}
      <DragAndDropFile fileRef={fileRef} initialFile={initialFile} />
    </form>
  );
}
