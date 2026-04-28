"use client";

import type { Message } from "@/types";

import { Avatar, Badge, Button } from "@heroui/react";
import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { Chat } from "@/components/chat";
import { useUser } from "@/hooks/useUser";

const URL = "http://localhost:3001";
const MAX_RETRIES = 2;

export function Messenger() {
  const [chatSelected, setChatSelected] = useState<string | null>(null);
  const [chats, setChats] = useState<Message[]>([]);
  const [unread, setUnread] = useState<Set<string>>(new Set());

  const user = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let retryCount = 0;
    let retryTimer: ReturnType<typeof setTimeout>;
    let socket: Socket | null = null;
    let token: string | null = null;

    const fetchChatsFallback = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${URL}/chats/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) setChats(await res.json());
        else console.error("Fallback fetch failed:", res.statusText);
      } catch (err) {
        console.error("Fallback fetch error:", err);
      }
    };

    const connectSocket = (authToken: string) => {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }

      socket = io(URL, {
        auth: { token: authToken },
        transports: ["websocket"], // evita polling y el tráfico constante
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        retryCount = 0;
        socket!.emit("get_chats");
      });

      socket.on("chats_list", (data: Message[]) => {
        setChats(data);
      });

      socket.on("new_message_notification", (data: { senderId?: string }) => {
        socket!.emit("get_chats");
        const senderId = data?.senderId;

        if (senderId && senderId !== user.id) {
          setUnread((prev) => new Set(prev).add(senderId));
        }
      });

      socket.on("connect_error", (err) => {
        console.error(
          `Socket error (intento ${retryCount + 1}/${MAX_RETRIES}):`,
          err.message,
        );

        if (retryCount < MAX_RETRIES) {
          retryCount++;
          const delay = retryCount * 1000;

          retryTimer = setTimeout(() => connectSocket(authToken), delay);
        } else {
          console.warn("Máx. reintentos alcanzados, usando fallback HTTP");
          fetchChatsFallback();
        }
      });
    };

    const initSocket = async () => {
      const currentUser = getAuth().currentUser;

      if (!currentUser) return;

      token = await currentUser.getIdToken(true);
      connectSocket(token);
    };

    initSocket();

    return () => {
      clearTimeout(retryTimer);
      socket?.removeAllListeners();
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  const handleOpenChat = useCallback((otherUserId: string) => {
    setChatSelected(otherUserId);
    setUnread((prev) => {
      const next = new Set(prev);

      next.delete(otherUserId);

      return next;
    });
  }, []);

  return (
    <div className="flex h-[92dvh] w-full overflow-hidden bg-background text-foreground">
      {/* LEFT */}
      <aside className="w-[40%] min-w-[280px] border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border font-medium">
          Conversations
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            if (!user) return null;

            const otherUserId =
              chat.sender === user.id ? chat.receiver : chat.sender;

            const hasUnread = unread.has(otherUserId);

            return (
              <Button
                key={otherUserId}
                className="w-full justify-start px-4 py-3 h-auto border-b border-border/50"
                variant="light"
                onPress={() => handleOpenChat(otherUserId)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Badge
                    color="danger"
                    content=""
                    isInvisible={!hasUnread}
                    placement="top-right"
                    size="sm"
                  >
                    <Avatar name={`User ${otherUserId}`} />
                  </Badge>

                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={`font-medium truncate ${
                        hasUnread ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      User {otherUserId}
                    </p>

                    <p
                      className={`text-xs truncate ${
                        hasUnread
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {chat.content ?? "No messages yet"}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </aside>

      {/* RIGHT */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {chatSelected && (
          <Chat receiver={chatSelected} socket={socketRef.current} />
        )}
      </main>
    </div>
  );
}
