import type { Devit } from "@/types";

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
  const response = await fetch(`/api/devits/${devitId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch devit");
  }

  const data = await response.json();

  const devit: Devit = {
    ...data,
    createdAt: new Date(data.createdAt),
  };

  return devit;
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
