export const getDevits = async () => {
  const response = await fetch("/api/devits", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch devits");
  }

  return response.json();
};
