"use client";

import type { Conversation, User } from "@/types";

import { Avatar, Badge, Button } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

import { Chat } from "@/components/chat";
import { useSocket } from "@/context/socket"; // 👈 NUEVO
import { useUser } from "@/context/user";
import { fetchChats } from "@/services/messenger";
import { getUser } from "@/services/user";

export function Messenger({ receiver }: { receiver?: string }) {
  const [chatSelected, setChatSelected] = useState<User | null>(null);
  const [chats, setChats] = useState<Conversation[]>([]);
  const [unread, setUnread] = useState<Set<string>>(new Set());

  const user = useUser();
  const { socket, isConnected } = useSocket(); // 👈 SOCKET GLOBAL

  useEffect(() => {
    if (receiver) {
      getUser(receiver)
        .then((data) => {
          if (data) setChatSelected(data);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    }
  }, [receiver]);

  // 👉 SOCKET LISTENERS (SOLO UI LOGIC)
  useEffect(() => {
    if (!socket || !isConnected || !user?.id) return;

    const handleNotification = (data: { senderId?: string }) => {
      socket.emit("get_chats");

      const senderId = data?.senderId;

      if (senderId && senderId !== user.id) {
        setUnread((prev) => new Set(prev).add(senderId));
      }
    };

    socket.on("chats_list", handleChats);
    socket.on("new_message_notification", handleNotification);

    // pedir chats iniciales
    socket.emit("get_chats");

    return () => {
      socket.off("chats_list", handleChats);
      socket.off("new_message_notification", handleNotification);
    };
  }, [socket, user?.id]);

  useEffect(() => {
    if (isConnected) return;
    (async () => {
      try {
        const conversations = await fetchChats(user?.id ?? "");

        setChats(conversations);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    })();
  }, [socket, user?.id]);

  useEffect(() => {
    if (chatSelected) {
      setUnread((prev) => {
        const next = new Set(prev);

        next.delete(chatSelected.id);

        return next;
      });
    }
  }, [chatSelected]);

  const handleChats = useCallback((data: Conversation[]) => {
    setChats(data);
  }, []);

  const handleOpenChat = useCallback((user: User) => {
    setChatSelected(user);

    setUnread((prev) => {
      const next = new Set(prev);

      next.delete(user.id);

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

            const otherUserId = chat.receiver.id;
            const hasUnread = unread.has(otherUserId);

            return (
              <Button
                key={otherUserId}
                className="w-full justify-start px-4 py-3 h-auto border-b border-border/50"
                variant="light"
                onPress={() => handleOpenChat(chat.receiver)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Badge
                    color="danger"
                    content=""
                    isInvisible={!hasUnread}
                    placement="top-right"
                    size="sm"
                  >
                    <Avatar
                      name={chat.receiver.name}
                      src={chat.receiver.avatar}
                    />
                  </Badge>

                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={`font-medium truncate ${
                        hasUnread ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {chat.receiver.name}
                    </p>

                    <p
                      className={`text-xs truncate ${
                        hasUnread
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {chat.lastMessage?.content ?? "No messages yet"}
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
        {chatSelected && <Chat receiver={chatSelected} />}
      </main>
    </div>
  );
}
