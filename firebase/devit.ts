import type { Devit } from "@/types";

import { auth } from "./app";

export const postDevit = async (devit: Devit) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await user.getIdToken();

  const response = await fetch("/api/compose/devit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(devit),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API ERROR:", response.status, data);
    throw new Error(data.message || "Failed to post devit");
  }

  return data;
};
