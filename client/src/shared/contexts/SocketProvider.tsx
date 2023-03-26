import React, { useEffect, useState, useContext } from "react";
import io, { Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

type SocketProviderProps = {
  id: string;
  children: React.ReactNode;
};

export function SocketProvider({ id, children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketUrl, setSocketUrl] = useState<string|null>(null);

  useEffect(() => {
    if (socketUrl !== null) {
      return;
    }
    if (process.env.REACT_APP_SOCKET_SERVER !== undefined) {
      setSocketUrl(process.env.REACT_APP_SOCKET_SERVER);
      return;
    }
    // get info from location
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    // get port from server
    fetch("/api/port").then(
      async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch port");
        }
        try {
          const data = await res.json();
          setSocketUrl(`${protocol}//${host}:${data}`);
        } catch (err) {
          setSocketUrl(`${protocol}//${host}:4242`);
        }
      }
    )
  }, [id, socketUrl]);

  useEffect(() => {
    if (socketUrl === null) {
      return;
    }
    console.log("Connecting to socket", socketUrl);
    const newSocket = io(socketUrl, {
      auth: { id },
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [id, socketUrl]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
