import type { DevtterPost } from "@/types";

import { Avatar } from "@heroui/react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";

export default function Post(post: DevtterPost) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <Avatar size="lg" src={post.author.photoURL} />

      {post.code && (
        <SyntaxHighlighter
          language={post.code.language}
          style={resolvedTheme === "dark" ? oneDark : oneLight}
        >
          {post.code.content}
        </SyntaxHighlighter>
      )}
    </>
  );
}
