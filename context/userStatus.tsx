"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSocket } from "@/context/socket";

type StatusMap = Record<string, boolean>;

interface UserStatusContextType {
  statuses: StatusMap;
  getUserStatus: (_userId: string) => boolean;
  fetchUserStatus: (_userId: string) => void;
}

const UserStatusContext = createContext<UserStatusContextType | null>(null);

export function UserStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket, isConnected } = useSocket();

  const [statuses, setStatuses] = useState<StatusMap>({});

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleStatusChanged = ({
      userId,
      online,
    }: {
      userId: string;
      online: boolean;
    }) => {
      setStatuses((prev) => ({
        ...prev,
        [userId]: online,
      }));
    };

    socket.on("user_status_changed", handleStatusChanged);

    return () => {
      socket.off("user_status_changed", handleStatusChanged);
    };
  }, [socket, isConnected]);

  const fetchUserStatus = useCallback(
    (userId: string) => {
      if (!socket) return;

      // evitar pedirlo varias veces
      if (statuses[userId] !== undefined) return;

      socket.emit("user:get_status", userId, (isOnline: boolean) => {
        setStatuses((prev) => ({
          ...prev,
          [userId]: isOnline,
        }));
      });
    },
    [socket, statuses],
  );

  const getUserStatus = useCallback(
    (userId: string) => {
      return statuses[userId] ?? false;
    },
    [statuses],
  );

  return (
    <UserStatusContext.Provider
      value={{
        statuses,
        getUserStatus,
        fetchUserStatus,
      }}
    >
      {children}
    </UserStatusContext.Provider>
  );
}

export function useUserStatus(userId: string) {
  const context = useContext(UserStatusContext);

  if (!context) {
    throw new Error("useUserStatus must be used inside UserStatusProvider");
  }

  const { getUserStatus, fetchUserStatus } = context;

  useEffect(() => {
    fetchUserStatus(userId);
  }, [fetchUserStatus, userId]);

  return getUserStatus(userId);
}
