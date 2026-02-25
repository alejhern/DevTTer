import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";
import Navbar from "@/components/navbar";

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
      <body
        className={clsx("min-h-screen bg-background font-sans antialiased")}
      >
        <HeroUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <Navbar />
            <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
              {children}
            </main>
          </NextThemesProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
