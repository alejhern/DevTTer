"use client";

import type { Message } from "@/types";

import { Avatar, Badge, Button } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { Chat } from "@/components/chat";
import { useUser } from "@/hooks/useUser";

const URL = "http://localhost:3001";

export function Messenger() {
  const [chatSelected, setChatSelected] = useState<string | null>(null);
  const [chats, setChats] = useState<Message[]>([]);
  const [unread, setUnread] = useState<Set<string>>(new Set()); // 👈 nuevo
  const user = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${URL}/chats/${user.id}`, {
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data: Message[]) => {
        setChats(data);

        // Marca como no leído si el último mensaje no es tuyo
        const newUnread = new Set<string>();

        data.forEach((chat) => {
          const otherUserId =
            chat.sender === user.id ? chat.receiver : chat.sender;

          if (chat.sender !== user.id) {
            newUnread.add(otherUserId);
          }
        });
        setUnread(newUnread);
      })
      .catch((err) => {
        console.error("Error fetching chats:", err);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const socket = io(URL, { auth: { userId: user.id } });

    socketRef.current = socket;

    socket.on("chats_list", (data: Message[]) => {
      setChats(data);
    });

    // 👇 El servidor debe enviarte el senderId en la notificación
    socket.on("new_message_notification", (data: { senderId?: string }) => {
      socket.emit("get_chats");

      // Marca como no leído si el mensaje viene de otro usuario
      if (data?.senderId && data.senderId !== user.id) {
        setUnread((prev) => new Set(prev).add(data.senderId!));
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  // Limpia el badge al abrir un chat
  const handleOpenChat = (otherUserId: string) => {
    setChatSelected(otherUserId);
    setUnread((prev) => {
      const next = new Set(prev);

      next.delete(otherUserId);

      return next;
    });
  };

  return (
    <div className="flex h-[92dvh] w-full overflow-hidden bg-background text-foreground">
      {/* 📋 LEFT */}
      <aside className="w-[40%] min-w-[280px] border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border font-medium">
          Conversations
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            if (!user) return null;
            const otherUserId =
              chat.sender === user?.id ? chat.receiver : chat.sender;
            const hasUnread = unread.has(otherUserId); // 👈

            return (
              <Button
                key={otherUserId}
                className="w-full justify-start px-4 py-3 h-auto border-b border-border/50"
                variant="light"
                onClick={() => handleOpenChat(otherUserId)}
              >
                <div className="flex items-center gap-3 w-full">
                  {/* Avatar + unread */}
                  <Badge
                    color="danger"
                    content=""
                    isInvisible={!hasUnread}
                    placement="top-right"
                    size="sm"
                  >
                    <Avatar className="shrink-0" name={`User ${otherUserId}`} />
                  </Badge>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`font-medium truncate ${
                          hasUnread
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        User {otherUserId}
                      </p>
                    </div>

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

      {/* 💬 RIGHT */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {chatSelected && (
          <Chat receiver={chatSelected} socket={socketRef.current} />
        )}
      </main>
    </div>
  );
}
