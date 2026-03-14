import { clsx, type ClassValue } from "clsx";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { twMerge } from "tailwind-merge";

import { storage } from "@/firebase/app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function getTimeAgo(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}sec`;
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}hours`;

  const days = Math.floor(hours / 24);

  return `${days}days`;
}

export const getDevitWithNComments = async (
  devitsSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
) => {
  return await Promise.all(
    devitsSnapshot.docs.map(async (doc) => {
      const commentsSnap = await doc.ref.collection("comments").count().get();

      const commentsCount = commentsSnap.data().count ?? 0;

      return {
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.(),
        comments: commentsCount,
      };
    }),
  );
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(
  formData: FormData,
  idDevit: string,
): Promise<string> {
  const imageFile = formData.get("image");

  if (!(imageFile instanceof File)) {
    throw new Error("Invalid image file");
  }
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error("Image file must be less than 5MB");
  }

  if (!imageFile.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const storageRef = ref(storage, `devits/${idDevit}/${imageFile.name}`);

  await uploadBytes(storageRef, buffer, {
    contentType: imageFile.type,
  });

  return await getDownloadURL(storageRef);
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, imageUrl);

    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}
