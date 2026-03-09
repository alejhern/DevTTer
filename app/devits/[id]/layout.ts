import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevTTer | Devit",
};

export default function DevitLayout({ children }: { children: ReactNode }) {
  return children;
}
