import type { Conversation, Message } from "@/types";

import { apiFetch } from "./api.client";

export const sendMessage = async (
  message: Omit<Message, "id">,
  receiverId: string,
): Promise<void> => {
  try {
    await apiFetch(`/chats/${receiverId}`, {
      method: "POST",
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const fetchChats = async (userId: string): Promise<Conversation[]> => {
  try {
    const data = await apiFetch(`/chats/${userId}`);

    return data as Conversation[];
  } catch (error) {
    console.error("Error fetching chats:", error);

    return [];
  }
};

export const fetchMessages = async (
  userId: string,
  receiverId: string,
): Promise<Message[]> => {
  try {
    const data = await apiFetch(`/chats/${userId}/${receiverId}`);

    return data as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);

    return [];
  }
};
