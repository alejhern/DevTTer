"use client";

import type { CodeSnippet, Message, User } from "@/types";

import { Avatar } from "@heroui/react";
import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import CodeBlock from "./codeBlock";
import { CodeInput } from "./codeInput";
import { AvatarUser } from "./ui/avatarUser";

import { useSocket } from "@/context/socket";
import { useUser } from "@/context/user";
import { useUserStatus } from "@/context/userStatus";
import WindowVSCode from "@/context/vscode";
import { fetchMessages, sendMessage } from "@/services/messenger";
import { UKNOWN_USER } from "@/types";

export function Chat({ receiver }: { receiver: User }) {
  const { socket, isConnected } = useSocket();
  const user = useUser();
  const online = useUserStatus(receiver.id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const codeSnippetRef = useRef<CodeSnippet | undefined>(undefined);

  const [code, setCode] = useState<CodeSnippet | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const historyLoadedRef = useRef(false);

  // JOIN CHAT
  useEffect(() => {
    if (!socket || !isConnected || !user?.id) return;

    socket.emit("join_chat", receiver.id);

    return () => {
      socket.emit("leave_chat", receiver.id);
    };
  }, [socket, user?.id, receiver.id]);

  const handleMessage = useCallback((data: Message) => {
    setMessages((prev) => [...prev, data]);
  }, []);

  // SOCKET
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  // HISTORY
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const messages = await fetchMessages(user.id, receiver.id);

        setMessages(messages);
      } catch (err) {
        console.error("Error fetching chat history:", err);
      } finally {
        historyLoadedRef.current = true;
      }
    })();
  }, [receiver.id, user?.id]);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: historyLoadedRef.current ? "smooth" : "auto",
    });
  }, [messages]);

  // SEND
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!input.trim()) return;

      const snippet = codeSnippetRef.current;

      const body: Omit<Message, "id"> = {
        content: input,
        code: snippet?.content?.trim()
          ? {
              content: snippet.content,
              language: snippet.language,
            }
          : undefined,
      };

      if (socket && isConnected) socket.emit("message", body, receiver.id);
      else {
        try {
          await sendMessage(body, receiver.id);
          handleMessage({
            ...body,
            id: crypto.randomUUID(),
            sender: user?.id,
            receiver: receiver.id,
            createdAt: new Date(),
          });
        } catch (err) {
          console.error("Error sending message:", err);
        }
      }

      setInput("");

      setCode({
        content: "",
        language: snippet?.language || "typescript",
      });

      codeSnippetRef.current = undefined;
    },
    [input, receiver.id, socket, isConnected, user?.id, handleMessage],
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* HEADER */}
      <header className="flex h-16 min-h-16 items-center border-b border-border bg-card px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <AvatarUser height={40} user={receiver} width={40} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold sm:text-base">
              {receiver.name}
            </h2>

            {online && <p className="text-xs text-muted-foreground">Online</p>}
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-background px-3 py-4 sm:px-5 sm:py-6">
        <div className="space-y-1">
          {messages.map((message, index) => {
            const isOwn = message.sender === user?.id;

            const prevMessage = messages[index - 1];
            const sender = isOwn ? user || UKNOWN_USER : receiver;

            const showAvatar =
              !prevMessage || prevMessage.sender !== message.sender;

            return (
              <div
                key={message.id}
                className={clsx(
                  "group flex gap-3 rounded-2xl px-2 py-2 transition-colors",
                  "hover:bg-content2/40",
                )}
              >
                {/* AVATAR */}
                <div className="w-10 shrink-0">
                  {showAvatar ? (
                    <Avatar name={sender.name} src={sender.avatar} />
                  ) : (
                    <div className="h-10 w-10" />
                  )}
                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                  {showAvatar && (
                    <div className="mb-5 flex items-center gap-2">
                      <span
                        className={clsx(
                          "text-sm font-semibold",
                          isOwn ? "text-primary" : "text-foreground",
                        )}
                      >
                        {isOwn ? "You" : sender.name}
                      </span>
                    </div>
                  )}

                  {/* MESSAGE BUBBLE */}
                  <div
                    className={clsx(
                      "max-w-[90%] rounded-2xl border px-4 py-3 shadow-sm",
                      isOwn
                        ? ["border-primary/20", "bg-primary/10"]
                        : ["border-border", "bg-card"],
                    )}
                  >
                    {/* TEXT */}
                    <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {message.content}
                    </p>

                    {/* CODE */}
                    {message.code && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-background">
                        <WindowVSCode codeSnippet={message.code}>
                          <CodeBlock />
                        </WindowVSCode>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <form
        className="border-t border-border bg-card p-3 sm:p-4"
        onSubmit={handleSubmit}
      >
        <div className="rounded-2xl border border-border bg-content1 p-3 shadow-sm">
          <input
            className={clsx(
              "w-full bg-transparent px-1 py-2 text-sm outline-none",
              "text-foreground placeholder:text-muted-foreground",
            )}
            placeholder={`Mensaje a ${receiver.name}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-background">
            <CodeInput codeSnipetRef={codeSnippetRef} initialCode={code} />
          </div>

          <div className="mt-3 flex justify-end">
            <button
              className={clsx(
                "w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all",
                "hover:opacity-90 active:scale-[0.98]",
                "sm:w-auto",
              )}
              type="submit"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
