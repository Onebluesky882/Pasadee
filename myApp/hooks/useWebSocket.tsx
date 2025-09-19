import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { create } from "zustand";
import { createSocket } from "../services/socket";

type WebSocketState = {
  socket: Socket | null;
  setSocket: (s: Socket) => void;
  ttsChunks: string[];
  addChunk: (chunk: string) => void;
  resetChunks: () => void;
};

export const useWebSocket = create<WebSocketState>(set => ({
  socket: null,
  setSocket: s => set({ socket: s }),
  ttsChunks: [],
  addChunk: chunk => set(state => ({ ttsChunks: [...state.ttsChunks, chunk] })),
  resetChunks: () => set(() => ({ ttsChunks: [] })),
}));

const useSocketManager = () => {
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
export default useSocketManager;
