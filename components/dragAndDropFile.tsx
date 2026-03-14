"use client";

import { useEffect, useState } from "react";

import { Button } from "./ui/button";

interface DragAndDropFileProps {
  file: File | null;
  handlerOnchange: (_file: File | null) => void;
  devitImg?: string; // URL de imagen existente (Firebase)
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function DragAndDropFile({
  file,
  handlerOnchange,
  devitImg,
}: DragAndDropFileProps) {
  const [preview, setPreview] = useState<string | null>(devitImg || null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file === null) return setPreview(null);
    if (file) {
      // Imagen local seleccionada
      const objectUrl = URL.createObjectURL(file);

      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    // Si no hay archivo local, mostrar imagen existente
    if (!file && devitImg) {
      setPreview(devitImg);

      return;
    }

    // Si no hay nada
    setPreview(null);
  }, [file, devitImg]);

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
    if (validateFile(file)) {
      handlerOnchange(file);
    }
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

          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      >
        {!file && !preview ? (
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
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* PREVIEW */}
            <div className="relative">
              {preview && (
                <img
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl shadow-lg border"
                  src={preview}
                />
              )}
              {/* REMOVE BUTTON */}
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow hover:scale-110 transition"
                type="button"
                onClick={() => {
                  handlerOnchange(null);
                  setPreview(null);
                }}
              >
                ✕
              </button>
            </div>
            {file && (
              <p className="text-sm text-green-500 font-medium">
                ✓ {file.name}
              </p>
            )}
            {!file && preview && (
              <p className="text-sm text-blue-500 font-medium">
                {preview.split("/").pop()} (existing image)
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
