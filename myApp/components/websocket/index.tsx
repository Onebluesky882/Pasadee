import { createSocket } from "@/services/socket";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
const webSocket = () => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const initSocket = async () => {
      const s = await createSocket();

      setSocket(s);

      s.on("connect", () => {
        console.log("Connnectecd to socket.io server");
      });
    };

    initSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);
  return null;
};
export default webSocket;
