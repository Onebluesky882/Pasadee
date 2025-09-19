import { useEffect } from "react";
import { io } from "socket.io-client";

export default function SocketTest() {
  useEffect(() => {
    const socket = io("http://192.168.1.38:3009", {
      transports: ["websocket"],
    });
    socket.emit("start", { sessionId: "session-test-1" });
    socket.on("transcription", data => console.log("📝 Transcription:", data));
    socket.on("ai-reply", data => console.log("🤖 GPT Reply:", data));
    socket.on("tts-chunk", data =>
      console.log("🔊 TTS Chunk:", data.chunkBase64?.length)
    );
    socket.on("tts-end", () => console.log("🔚 TTS session ended"));

    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("disconnect", () => console.log("⚠️ Disconnected"));
    socket.on("connect_error", err => console.error("❌ Connect error:", err));
  }, []);

  return null;
}
