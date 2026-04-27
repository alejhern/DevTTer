import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevTTer | Chat",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
