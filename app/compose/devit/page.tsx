"use client";
import { Button } from "@heroui/button";
import { useSearchParams } from "next/navigation";

import AutorizePage from "@/components/autorizePage";
import CodeEditor from "@/components/codeEditor";
import DragAndDropFile from "@/components/dragAndDropFile";
import VScode from "@/components/vscodelayout";
import { useComposeDevit } from "@/hooks/useComposeDevit";

export default function ComposeDevit() {
  const searchParams = useSearchParams();
  const idDevit = searchParams.get("edit") || undefined;
  const {
    devit,
    handleContentChange,
    handleCodeChange,
    handleSubmit,
    file,
    handlerOnchangeFile,
    isPosting,
  } = useComposeDevit(idDevit);

  return (
    <AutorizePage>
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
          {/* Content */}
          <textarea
            className="w-full min-h-[200px] text-lg bg-transparent outline-none resize-none mb-8 leading-relaxed"
            placeholder="Write your thoughts..."
            value={devit.content}
            onChange={(e) => handleContentChange(e)}
          />

          {/* Code Section */}
          <div className="mb-8">
            <div className="flex gap-4 items-center mb-3">
              <h1 className="text-sm text-zinc-500">Code</h1>

              <select
                className="text-sm border rounded-md px-2 py-1 dark:bg-zinc-800 dark:border-zinc-700"
                value={devit.code.language ?? "typescript"}
                onChange={handleCodeChange("language")}
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="tsx">TSX</option>
                <option value="python">Python</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            <VScode>
              <CodeEditor
                code={devit.code.content}
                language={devit.code.language ?? "typescript"}
                onChange={(value) => {
                  const event = { target: { value } } as any;

                  handleCodeChange("content")(event);
                }}
              />
            </VScode>
          </div>

          {/* Image Upload */}
          <DragAndDropFile
            devitImg={devit.imageUrl}
            file={file}
            handlerOnchange={handlerOnchangeFile}
          />
        </form>
      </div>
    </AutorizePage>
  );
}
