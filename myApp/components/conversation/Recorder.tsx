import { useWebSocket } from "@/hooks/useWebSocket";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useRef } from "react";
import { Button, View } from "react-native";
type RecordProp = {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
};

const Recorder = ({ isRecording, setIsRecording }: RecordProp) => {
  const socket = useWebSocket(state => state.socket);
  const sessionId = useRef("session-" + Date.now());
  const chunkSeq = useRef(0);
  const stopFlag = useRef(false);

  const startRecording = async () => {
    setIsRecording(true);
    if (!socket) {
      console.log("socket not connected !");
      return;
    }

    stopFlag.current = false;

    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      console.warn("❌ Permission denied");
      setIsRecording(false);
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
    });
    console.log("🎙 Recording loop started");

    while (!stopFlag.current) {
      const recording = new Audio.Recording();
      try {
        await recording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.LOW_QUALITY
        );
        await recording.startAsync();
        console.log("chunk recording started");

        // อัดเสียง ~2 วินาที
        await new Promise(r => setTimeout(r, 5000));

        await recording.stopAndUnloadAsync();
        console.log("chunk recording stopped");

        const uri = recording.getURI();

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
        console.error("❌ Recording error:", error);
        break;
      }
    }
    console.log("recording loop ended");
    setIsRecording(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    stopFlag.current = true;
    console.log("stop requested (soft-stop, waits current chunk)");
  };

  return (
    <View>
      <Button
        title={isRecording ? "Recording..." : "Start Recording"}
        onPress={startRecording}
      />
      <Button title="Stop" onPress={stopRecording} />
    </View>
  );
};
export default Recorder;
