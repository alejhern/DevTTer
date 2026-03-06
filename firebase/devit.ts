import type { Comment as DevitComment, Devit } from "@/types";

import { auth } from "./app";

export const postDevit = async (
  devit: Omit<Devit, "id" | "createdAt">,
  file: File | null,
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await user.getIdToken();
  const formData = new FormData();

  formData.append("devit", JSON.stringify(devit));
  if (file) formData.append("image", file);

  const response = await fetch("/api/compose/devit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API ERROR:", response.status, data);
    throw new Error(data.message || "Failed to post devit");
  }

  return data;
};

export const fetchDevit = async (devitId: string): Promise<Devit> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/devits/${devitId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch devit: ${response.statusText}`);
    }

    const data = await response.json();
    const comments: Array<DevitComment> = Array.isArray(data.comments)
      ? data.comments.map((comment: DevitComment) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
        }))
      : [];

    const devit: Devit = {
      ...data,
      comments,
      createdAt: new Date(data.createdAt),
    };

    return devit;
  } catch (error: any) {
    console.error("Error fetching devit:", error);
    throw error;
  }
};

export const likeDevit = async (devitId: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await user.getIdToken();

  const response = await fetch(`/api/devits/${devitId}/like`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API ERROR:", response.status, data);
    throw new Error(data.message || "Failed to like devit");
  }

  return data;
};

export const commentOnDevit = async (
  devitId: string,
  comment: Omit<DevitComment, "id" | "createdAt">,
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await user.getIdToken();

  const formData = new FormData();

  formData.append("comment", JSON.stringify(comment));

  const response = await fetch(`/api/compose/devit/${devitId}/comment`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API ERROR:", response.status, data);
    throw new Error(data.message || "Failed to comment on devit");
  }

  return data;
};
