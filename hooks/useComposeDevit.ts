import type { Devit } from "@/types";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { postDevit } from "@/firebase/devit";

export function useComposeDevit() {
  const [file, setFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const route = useRouter();

  const [devit, setDevit] = useState<
    Omit<Devit, "id" | "author" | "createdAt">
  >({
    title: "",
    content: "",
    code: {
      language: "typescript",
      content: "",
    },
  });

  const handleChange = useCallback(
    (field: keyof Devit) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDevit((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      },
    [],
  );

  const handleCodeChange = useCallback(
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
      },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !devit.title.trim() ||
        !devit.content.trim() ||
        !devit.code.content.trim()
      )
        return;

      setIsPosting(true);
      try {
        console.log("Posting:", devit);

        const res = await postDevit(devit, file);
        const idDevit = res.id;

        console.log("Devit posted successfully");
        route.push("/devits/" + idDevit);
      } catch (error) {
        console.error("Error posting devit:", error);
      } finally {
        setIsPosting(false);
      }
    },
    [devit, file, route],
  );

  const handlerOnchangeFile = useCallback((file: File | null) => {
    setFile(file);
  }, []);

  return {
    devit,
    handleChange,
    handleCodeChange,
    handleSubmit,
    file,
    handlerOnchangeFile,
    isPosting,
  };
}
