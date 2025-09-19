import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
const TTSPlayer = () => {
  const ttsChunks = useWebSocket(state => state.ttsChunks);
  const resetChunks = useWebSocket(state => state.resetChunks);
  const [isPlaying, setIsPlaying] = useState(false);

  const queueRef = useRef<string[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const addNewFiles = async () => {
      for (let i = queueRef.current.length; i < ttsChunks.length; i++) {
        const base64 = ttsChunks[i];
        const uri = FileSystem.cacheDirectory + `tts-${Date.now()}-${i}.caf`;
        await FileSystem.writeAsStringAsync(uri, base64, {
          encoding: "base64",
        });
        queueRef.current.push(uri);
      }
      if (!isPlaying) {
        playNext();
      }
    };
    addNewFiles();
  }, [ttsChunks]);

  // ฟังก์ชันเล่นเสียงแบบ queue
  const playNext = async () => {
    const nextUri = queueRef.current.shift();
    if (!nextUri) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    try {
      const sound = new Audio.Sound();
      soundRef.current = sound;

      await sound.loadAsync({ uri: nextUri });
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate(status => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          sound.unloadAsync();
          playNext(); // เล่นไฟล์ถัดไป
        }
      });
    } catch (err) {
      console.error("Play error:", err);
      playNext(); // ข้ามถ้ามี error
    }
  };
  useEffect(() => {
    const socket = useWebSocket.getState().socket;
    if (!socket) return;

    socket.on("tts-end", () => {
      console.log("🔚 TTS session ended");
      resetChunks(); // ล้าง chunks
      queueRef.current = []; // ล้าง queue
      soundRef.current?.unloadAsync();
    });

    return () => {
      socket?.off("tts-end");
    };
  }, []);

  return null;
};
export default TTSPlayer;
