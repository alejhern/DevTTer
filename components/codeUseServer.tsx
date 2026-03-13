"use client";
import CodeUser from "./codeUser";

interface CodeUserServerProps {
  children: React.ReactElement<{
    code: string;
    language: string;
    theme?: "light" | "dark";
  }>;
  dissableActions?: boolean;
}
export default function CodeUserServer({
  children,
  dissableActions = false,
}: CodeUserServerProps) {
  return <CodeUser dissableActions={dissableActions}>{children}</CodeUser>;
}
