import { Text, View } from "@gluestack-ui/themed";
import Recorder from "../components/conversation/Recorder";
import { useRecorder } from "../hooks/useRecorder";
import { useTTSPlayer } from "../hooks/useTTSPlayer";
import { useSocketManager } from "../hooks/useWebSocket";
export default function index() {
  const { isRecording, startRecording, stopRecording } = useRecorder();
  const { isPlaying } = useTTSPlayer();
  useSocketManager();

  return (
    <View flex={1} className="flex-1 justify-center items-center">
      <Recorder
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />

      <Text>{isPlaying ? "🎧  playing..." : "Idle"}</Text>
    </View>
  );
}
