import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline | DevTTer",
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
