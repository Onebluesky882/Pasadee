import { View } from "@gluestack-ui/themed";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet } from "react-native";
import { Socket, io } from "socket.io-client";

export default function index() {
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sound, setSound] = useState<Audio.Recording | null>(null);
  const rec = new Audio.Recording();
  useEffect(() => {
    socketRef.current = io("http://localhost:3008/api/ws/voice");
    socketRef.current.on("connect", () =>
      console.log("connected", socketRef.current?.id)
    );

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // 🔹 Start recording and send chunks every 1s
  const startRecording = async () => {
    console.log("Requesting permissions...");

    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      console.warn("Permission not granted!");
      return;
    }
    console.log("Starting recording...");
    const rec = new Audio.Recording();

    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.LOW_QUALITY);
    await rec.startAsync();
    recordingRef.current = rec;
    setIsRecording(true);
    console.log("Recording started");

    intervalRef.current = setInterval(async () => {
      const uri = rec.getURI();
      if (uri) {
        try {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const buffer = Buffer.from(base64, "base64");
          console.log("Emit audio chunk, size:", base64.length);
          socketRef.current?.emit("audio-chunk", { base64 });
        } catch (error) {
          console.error("Chunk error:", error);
        }
      }
    }, 2000);
    console.log("Recording started!");
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    await recordingRef.current.stopAndUnloadAsync();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const uri = recordingRef.current.getURI();
    console.log("Recording stopped. File saved at:", uri);

    setIsRecording(false);
    recordingRef.current = null;
  };

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ecf0f1",
  },
});
