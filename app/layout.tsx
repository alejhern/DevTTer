import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import Navbar from "@/components/navbar";
import { fontSans } from "@/config/fonts";
import RootProviders from "@/context/root.provider";

export const metadata: Metadata = {
  title: "DevTTer",
  description: "A Twitter clone built with Next.js and HeroUI",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={fontSans.variable} lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <RootProviders>
          <Navbar />
          <main className="container mx-auto w-full">{children}</main>
        </RootProviders>
      </body>
    </html>
  );
}
