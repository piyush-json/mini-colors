import { createContext, useContext, ReactNode } from "react";
import { useSocketIO } from "@/lib/useSocketIO";

const SocketContext = createContext<ReturnType<typeof useSocketIO> | null>(
  null,
);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const serverUrl = process.env.NEXT_PUBLIC_WS_URL;
  const socket = useSocketIO(serverUrl);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
