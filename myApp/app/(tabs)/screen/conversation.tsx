import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";

export default function index() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  const playRecording = async () => {
    if (!audioRecorder.uri) {
      Alert.alert("no recording available");
      return;
    }

    if (sound) {
      await sound.playAsync();
      setSound(null);
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      {
        uri: audioRecorder.uri,
      },
      { shouldPlay: true }
    );

    setSound(newSound);
  };
  return (
    <View style={styles.container}>
      <Button
        title={recorderState.isRecording ? "Stop Recording" : "Start Recording"}
        onPress={recorderState.isRecording ? stopRecording : record}
      />

      <View>
        <Button title="Play Recording" onPress={playRecording} />
      </View>
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
