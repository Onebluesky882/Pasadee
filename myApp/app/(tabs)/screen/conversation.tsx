import { Buffer } from "buffer";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useEffect } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import API from "../../../api/record-voice";

export default function Index() {
  const audioRecorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    })();
  }, []);

  const record = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecordingAndSend = async (audioUri: string) => {
    // ตรวจสอบนามสกุลไฟล์
    const ext = audioUri.endsWith(".m4a") ? "m4a" : "mp3";
    const type = ext === "m4a" ? "audio/m4a" : "audio/mpeg";

    const formData = new FormData();
    formData.append("file", {
      uri: audioUri,
      type,
      name: `recording.${ext}`,
    } as any);

    try {
      const res = await API.post("record-voice/stt-tts", formData, {
        responseType: "arraybuffer",
        headers: { "Content-Type": "multipart/form-data" },
      });

      // แปลง ArrayBuffer → Base64
      const base64 = Buffer.from(res.data).toString("base64");

      // เขียนไฟล์ลง cache
      const fileUri = FileSystem.cacheDirectory + "speech.mp3";
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // เล่นเสียง
      const { sound } = await Audio.Sound.createAsync(
        { uri: `file://${fileUri}` },
        { shouldPlay: true }
      );
      await sound.playAsync();

      return sound;
    } catch (error) {
      console.error("TTS failed:", error);
      return null;
    }
  };

  const handlePress = async () => {
    if (recorderState.isRecording) {
      try {
        await audioRecorder.stop();
        recorderState.isRecording = false;

        if (audioRecorder.uri) {
          await stopRecordingAndSend(audioRecorder.uri);
        }
      } catch (error) {
        console.error("Stop recording failed:", error);
      }
    } else {
      await record();
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recorderState.isRecording ? "Stop Recording" : "Start Recording"}
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});
