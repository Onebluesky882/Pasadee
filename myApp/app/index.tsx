import { View } from "@gluestack-ui/themed";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useRef, useState } from "react";
import { Button } from "react-native";
import { socket } from "../services/socket";
export default function index() {
  const sessionId = useRef("session-" + Date.now());
  const chunkSeq = useRef(0);
  const [isRecording, setIsRecording] = useState(false);
  const stopFlag = useRef(false);
  const isChunkRecording = useRef(false);
  const startRecordingLoop = async () => {
    if (isRecording) return;
    setIsRecording(true);
    stopFlag.current = false;
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      console.warn("❌ Permission denied");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
    });

    while (!stopFlag.current) {
      isChunkRecording.current = true;
      const chunkRecording = new Audio.Recording();

      try {
        await chunkRecording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.LOW_QUALITY
        );
        await chunkRecording.startAsync();
        console.log("🎙 Recording started");

        // อัด audio 1–2 วิ
        await new Promise(res => setTimeout(res, 2000));

        // stop momentary (chunk) → read base64 → restart recording
        await chunkRecording.stopAndUnloadAsync();
        isChunkRecording.current = false;

        const uri = chunkRecording.getURI();

        if (uri) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: "base64",
          });

          socket.emit("audio-chunk", {
            sessionId: sessionId.current,
            seq: chunkSeq.current++,
            chunkBase64: base64,
          });
          console.log("📤 Sent chunk", chunkSeq.current);
        }
      } catch (error) {
        console.error("Recording loop error:", error);
        isChunkRecording.current = false;
        break;
      }
    }
  };

  const stopRecordingLoop = () => {
    stopFlag.current = true; // บอก loop ให้หยุดหลัง chunk ปัจจุบัน
    setIsRecording(false);
    console.log("Stop requested, loop will stop after current chunk");
  };

  return (
    <View flex={1} className="flex-1 justify-center items-center">
      <Button
        title={isRecording ? "Recording..." : "Start Recording"}
        onPress={startRecordingLoop}
      />
      <Button title="Stop" onPress={stopRecordingLoop} />
    </View>
  );
}
