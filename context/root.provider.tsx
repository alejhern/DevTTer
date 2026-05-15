"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";

import { SocketProvider } from "./socket";
import { UserProvider } from "./user";
import { UserStatusProvider } from "./userStatus";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <HeroUIProvider>
        <UserProvider>
          <SocketProvider>
            <UserStatusProvider>{children}</UserStatusProvider>
          </SocketProvider>
        </UserProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
