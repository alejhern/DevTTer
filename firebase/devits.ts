import type { Devit } from "@/types";

export const getDevits = async (extraQuery?: string): Promise<Devit[]> => {
  const response = await fetch(
    `http://localhost:3000/api/devits/${extraQuery ? `?${extraQuery}` : ""}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch devits");
  }

  const data = await response.json();
  const devits: Devit[] = data.map((devit: any) => ({
    ...devit,
    createdAt: new Date(devit.createdAt),
  }));

  return devits;
};
