"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        socketRef.current?.disconnect();
        socketRef.current = null;
        setIsConnected(false);

        return;
      }

      const token = await user.getIdToken();

      // Evitar duplicados
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = io("http://localhost:3001", {
        auth: {
          token, // 👈 ESTO es lo que tu backend espera
        },
        transports: ["websocket"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });
    });

    return () => {
      unsubscribe();
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
