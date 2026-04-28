"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Socket } from "socket.io-client";

import CodeBlock from "./codeBlock";
import { CodeInput } from "./codeInput";

import VSCode from "@/context/vscode";
import { useUser } from "@/hooks/useUser";
import { CodeSnippet, type Message } from "@/types";

export function Chat({
  receiver,
  socket,
}: {
  receiver: string;
  socket: Socket | null;
}) {
  const user = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const codeSnippetRef = useRef<CodeSnippet | undefined>(undefined);
  const [code, setCode] = useState<CodeSnippet | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  // 🔌 JOIN CHAT (solo cuando hay datos válidos)
  useEffect(() => {
    if (!socket || !user?.id || !receiver) return;

    socket.emit("join_chat", receiver);

    return () => {
      socket.emit("leave_chat", receiver);
    };
  }, [socket, user?.id, receiver]);

  // 🔌 SOCKET LISTENER (independiente del join)
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  // 📥 HISTORIAL
  useEffect(() => {
    if (!user?.id || !receiver) return;

    fetch(`http://localhost:3001/chats/${user.id}/${receiver}`, {
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        const msgs = Array.isArray(data) ? data : (data.messages ?? []);

        setMessages(msgs);
        firstLoad.current = false;
      })
      .catch(console.error);
  }, [user?.id, receiver]);

  // 🔽 AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: firstLoad.current ? "auto" : "smooth",
    });

    firstLoad.current = false;
  }, [messages]);

  // 📤 SEND MESSAGE
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !socket) return;

      const body: Omit<Message, "id" | "sender" | "receiver" | "createdAt"> = {
        content: input,
        code:
          codeSnippetRef.current && codeSnippetRef.current.content.trim()
            ? {
                content: codeSnippetRef.current.content,
                language: codeSnippetRef.current.language,
              }
            : undefined,
      };

      socket.emit("message", body, receiver);

      setInput("");
      setCode({ content: "", language: code?.language ?? "typescript" });
      codeSnippetRef.current = undefined;
    },
    [socket, receiver, input],
  );

  return (
    <div className="flex flex-col h-full bg-background text-foreground transition-colors">
      <div className="px-4 py-3 border-b border-border bg-card/60 backdrop-blur-md font-medium">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">
          {messages.map((msg) => {
            const isMe = msg.sender === user?.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && <div className="w-8 h-8 rounded-full bg-muted" />}

                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm border ${
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>

                    {msg.code && (
                      <VSCode codeSnippet={msg.code}>
                        <CodeBlock />
                      </VSCode>
                    )}
                  </div>
                </div>

                {isMe && <div className="w-8 h-8 rounded-full bg-primary" />}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        className="p-4 border-t border-border bg-card/60 flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <input
          className="p-2 rounded-md border border-border"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="rounded-md border border-border overflow-hidden">
          <CodeInput codeSnipetRef={codeSnippetRef} initialCode={code} />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
