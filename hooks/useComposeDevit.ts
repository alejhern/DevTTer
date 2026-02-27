import type { Devit } from "@/types";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { useUser } from "@/hooks/useUser";
import { postDevit } from "@/firebase/devit";

export function useComposeDevit(user: ReturnType<typeof useUser>) {
  const [file, setFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const route = useRouter();

  const [devit, setDevit] = useState<Devit>({
    id: uuidv4(),
    title: "",
    content: "",
    author: user as NonNullable<typeof user>,
    createdAt: new Date(),
    code: undefined,
  });

  useEffect(() => {
    if (user) {
      setDevit((prev) => ({
        ...prev,
        author: user,
      }));
    }
  }, [user]);

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
      if (!devit.title.trim() || !devit.content.trim()) return;

      setIsPosting(true);
      try {
        console.log("Posting:", devit);

        await postDevit(devit, file);
        console.log("Devit posted successfully");
        route.push("/timeline");
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
