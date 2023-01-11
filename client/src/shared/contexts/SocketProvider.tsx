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

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_SOCKET_SERVER || "http://localhost:4242", {
            auth: { id },
        });
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
