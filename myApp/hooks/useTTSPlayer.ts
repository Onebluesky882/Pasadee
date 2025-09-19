import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "./useWebSocket";

export const useTTSPlayer = () => {
  const ttsChunks = useWebSocket(state => state.ttsChunks);
  const resetChunks = useWebSocket(state => state.resetChunks);

  const [isPlaying, setIsPlaying] = useState(false);
  const queueRef = useRef<string[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ✅ auto-run เมื่อมี chunk ใหม่
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
          playNext();
        }
      });
    } catch (err) {
      console.error("Play error:", err);
      playNext();
    }
  };

  // ✅ listen tts-end event
  useEffect(() => {
    const socket = useWebSocket.getState().socket;
    if (!socket) return;

    socket.on("tts-end", () => {
      console.log("🔚 TTS session ended");
      resetChunks();
      queueRef.current = [];
      soundRef.current?.unloadAsync();
    });

    return () => {
      socket?.off("tts-end");
    };
  }, [resetChunks]);

  return { isPlaying };
};
