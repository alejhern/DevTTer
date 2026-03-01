"use client";
import CodeUser from "./codeUser";
import CodeBlock from "./codeBlock";

interface CodeUserServerProps {
  language: string;
  code: string;
}
export default function CodeUserServer({
  language,
  code,
}: CodeUserServerProps) {
  return (
    <CodeUser>
      <CodeBlock code={code} language={language} />
    </CodeUser>
  );
}
