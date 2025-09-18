import { useWebSocket } from "@/hooks/useWebSocket";
import { createSocket } from "@/services/socket";
import { useEffect } from "react";
const WebSocketProvider = () => {
  const setSocket = useWebSocket(state => state.setSocket);
  const addChunk = useWebSocket(state => state.addChunk);
  useEffect(() => {
    const initSocket = async () => {
      const webSocket = await createSocket();

      setSocket(webSocket);

      webSocket.on("connect", () => console.log("Connected"));
      webSocket.on("tts-chunk", (chunk: string) => addChunk(chunk));
      webSocket.on("tts-end", () => console.log("TTS End"));
    };

    initSocket();

    return () => {
      const socket = useWebSocket.getState().socket;
      socket?.disconnect();
      console.log("socket disconnected");
    };
  }, []);
  return null;
};
export default WebSocketProvider;
