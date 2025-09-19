import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type WebSocketState = {
  socket: Socket | null;
  setSocket: (s: Socket) => void;
  ttsChunks: string[];
  addChunk: (chunk: string) => void;
  resetChunks: () => void;
};

export const useWebSocket = create<WebSocketState>(set => ({
  socket: null,
  setSocket: (s: Socket) => set({ socket: s }),
  ttsChunks: [],
  addChunk: (chunk: string) =>
    set(state => ({ ttsChunks: [...state.ttsChunks, chunk] })),
  resetChunks: () => set(() => ({ ttsChunks: [] })),
}));

export const useSocketManager = () => {
  const setSocket = useWebSocket(state => state.setSocket);
  const addChunk = useWebSocket(state => state.addChunk);

  useEffect(() => {
    const socket = io("http://192.168.1.38:3009", {
      transports: ["websocket"],
    });

    setSocket(socket);

    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("disconnect", () => console.log("⚠️ Disconnected"));
    socket.on("connect_error", err => console.error("❌ Connect error:", err));

    socket.on("tts-chunk", (data: { chunkBase64: string }) =>
      addChunk(data.chunkBase64)
    );
    socket.on("tts-end", () => console.log("🔚 TTS End"));

    return () => {
      socket.disconnect();
      console.log("🛑 Socket disconnected (cleanup)");
    };
  }, [setSocket, addChunk]);
};
