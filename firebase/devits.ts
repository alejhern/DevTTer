import type { Devit } from "@/types";

export const getDevits = async (extraQuery?: string): Promise<Devit[]> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/devits/${extraQuery ? `${extraQuery}` : ""}`,
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
};

export const getUserDevits = async (userId: string): Promise<Devit[]> => {
  try {
    return await getDevits(`users/${userId}`);
  } catch (error: any) {
    console.error("Error fetching user devits:", error);

    return [];
  }
};
