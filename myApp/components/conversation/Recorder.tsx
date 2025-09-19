import { Button, View } from "react-native";

type RecorderProps = {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
};

const Recorder = ({
  startRecording,
  stopRecording,
  isRecording,
}: RecorderProps) => {
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
