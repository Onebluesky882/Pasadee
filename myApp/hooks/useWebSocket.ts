import { Socket } from "socket.io-client";
import { create } from "zustand";

type WebSocket = {
  socket: Socket | null;
  setSocket: (s: Socket) => void;
  ttsChunks: string[];
  addChunk: (chunk: string) => void;
  resetChunks: () => void;
};

export const useWebSocket = create<WebSocket>(set => ({
  socket: null,
  setSocket: s => set({ socket: s }),
  ttsChunks: [],
  addChunk: chunk => set(state => ({ ttsChunks: [...state.ttsChunks, chunk] })),
  resetChunks: () => set(() => ({ ttsChunks: [] })),
}));
