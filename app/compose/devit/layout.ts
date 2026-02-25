import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevTTer | Add Devit",
};

export default function FormDevitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
