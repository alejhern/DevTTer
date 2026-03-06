import type { Devit } from "@/types";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export async function getDevitsFromServer(idUser?: string): Promise<Devit[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/devits/${idUser ? `user/${idUser}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch devits");
    }

    const data = await response.json();

    return data.map((devit: Devit) => ({
      ...devit,
      createdAt: new Date(devit.createdAt),
      comments: Number(devit.comments ?? 0), // Convert comments to number if it's not an array
    }));
  } catch (error: any) {
    console.error("Error fetching devits:", error);

    return [];
  }
}
