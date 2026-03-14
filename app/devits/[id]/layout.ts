import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DevTTer | Devit",
};

export default function DevitLayout({ children }: { children: ReactNode }) {
  return children;
}
