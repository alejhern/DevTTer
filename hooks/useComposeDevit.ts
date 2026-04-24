import type { CodeSnippet, Devit } from "@/types";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { fetchDevit, postDevit, putDevit } from "@/firebase/devit";

export function useComposeDevit(idDevit?: string) {
  const [content, setContent] = useState<string>("");
  const [isPosting, setIsPosting] = useState(false);
  const [initialCode, setInitialCode] = useState<CodeSnippet | undefined>(
    undefined,
  );
  const [initialFile, setInitialFile] = useState<string | undefined>(undefined);

  const fileRef = useRef<File | null | string | undefined>(undefined);
  const codeSnippetRef = useRef<CodeSnippet | undefined>(undefined);

  const route = useRouter();

  useEffect(() => {
    if (!idDevit) return;

    const loadDevit = async () => {
      try {
        const devitDB = await fetchDevit(idDevit);

        const imageUrl = devitDB.imageUrl as string | undefined;
        const code = devitDB.code as CodeSnippet | undefined;

        codeSnippetRef.current = code;
        fileRef.current = imageUrl;

        // Actualizar estado para que los componentes se re-rendericen con los valores iniciales
        setInitialFile(imageUrl);
        setInitialCode(code);
        setContent(devitDB.content);
      } catch (error) {
        console.error("Error fetching devit:", error);
      }
    };

    loadDevit();
  }, [idDevit]);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      if (isPosting) return;
      e.preventDefault();

      const code = codeSnippetRef.current;

      if (!code) return;

      setIsPosting(true);

      const devitData: Omit<Devit, "id" | "author" | "createdAt"> = {
        content: content.trim(),
        code,
      };

      const file =
        typeof fileRef.current === "string" ? undefined : fileRef.current;

      try {
        const res = idDevit
          ? await putDevit(idDevit, devitData, file)
          : await postDevit(devitData, file as File | undefined);

        console.log("Devit posted successfully");

        route.push("/devits/" + res.id);
      } catch (error) {
        console.error("Error posting devit:", error);
        setIsPosting(false);
      }
    },
    [content, idDevit, isPosting, route],
  );

  const handlerOnchangeFile = useCallback((file: File | null | undefined) => {
    fileRef.current = file;
  }, []);

  const handleCodeChange = useCallback((code?: CodeSnippet) => {
    codeSnippetRef.current = code;
  }, []);

  return {
    content,
    handleContentChange,
    handleCodeChange,
    handleSubmit,
    fileRef,
    handlerOnchangeFile,
    isPosting,
    codeSnippetRef,
    initialCode,
    initialFile,
  };
}
