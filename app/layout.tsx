import "@/styles/globals.css";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";
import Navbar from "@/components/navbar";

export const metadata = {
  title: "DevTTer",
  description: "A Twitter clone built with Next.js and HeroUI",
  language: "en",
  openGraph: {
    title: "DevTTer",
    description: "A Twitter clone built with Next.js and HeroUI",
    url: "https://devtter.com",
    siteName: "DevTTer",
    images: [
      {
        url: "https://devtter.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
