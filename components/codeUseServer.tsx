"use client";
import CodeUser from "./codeUser";

interface CodeUserServerProps {
  children: React.ReactElement<{
    code: string;
    language: string;
    theme?: "light" | "dark";
  }>;
}
export default function CodeUserServer({ children }: CodeUserServerProps) {
  return <CodeUser>{children}</CodeUser>;
}
