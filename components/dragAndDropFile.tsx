"use client";

import { useEffect, useState } from "react";

import { Button } from "./ui/button";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type Props = {
  fileRef: React.MutableRefObject<File | null | string | undefined>;
  initialFile?: string;
};

export default function DragAndDropFile({ fileRef, initialFile }: Props) {
  const [preview, setPreview] = useState<string | null>(() => {
    if (initialFile) return initialFile;

    return null;
  });
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const file = fileRef.current;

    if (!file || typeof file === "string")
      return setPreview(initialFile ?? null);
    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  // Sincroniza preview cuando initialFile llega tarde (fetch en el padre)
  useEffect(() => {
    if (!initialFile) return;
    setPreview(initialFile);
    fileRef.current = initialFile;
  }, [initialFile, fileRef]);

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");

      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB.");

      return false;
    }
    setError(null);

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;
    fileRef.current = file;
    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  const removeFile = () => {
    fileRef.current = null;
    setPreview(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* DROPZONE */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
          ${
            dragActive
              ? "border-black dark:border-white bg-zinc-100 dark:bg-zinc-800 scale-[1.02]"
              : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          }`}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files?.[0];

          if (file) handleFile(file);
        }}
      >
        {!preview ? (
          <>
            <p className="text-sm text-zinc-500 mb-3">
              Drag & drop your image here (max 5MB)
            </p>

            <Button
              color="primary"
              type="button"
              variant="outline"
              onClick={() => document.getElementById("imageUpload")?.click()}
            >
              Select Image
            </Button>

            <input
              accept="image/*"
              className="hidden"
              id="imageUpload"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) handleFile(file);
              }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* PREVIEW */}
            <div className="relative">
              <img
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl shadow-lg border"
                src={preview}
              />

              {/* REMOVE BUTTON */}
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:scale-110 transition"
                type="button"
                onClick={removeFile}
              >
                ✕
              </button>
            </div>

            {fileRef.current && typeof fileRef.current !== "string" && (
              <p className="text-sm text-green-500 font-medium">
                ✓ {fileRef.current.name}
              </p>
            )}

            {fileRef.current && typeof fileRef.current === "string" && (
              <p className="text-sm text-blue-500 font-medium">
                existing image
              </p>
            )}
          </div>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
