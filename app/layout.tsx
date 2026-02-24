import "@/styles/globals.css";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import clsx from "clsx";

import DefaultLayout from "@/layouts/default";
import { fontSans } from "@/config/fonts";

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
            <DefaultLayout>{children}</DefaultLayout>
          </NextThemesProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
