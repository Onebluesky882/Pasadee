import { View } from "@gluestack-ui/themed";
import { useState } from "react";
import Recorder from "../components/conversation/Recorder";
import TTSPlayer from "../components/conversation/TTSPlayer";
import useSocketManager from "../hooks/useWebSocket";
export default function index() {
  useSocketManager();
  const [isRecording, setIsRecording] = useState(false);

  console.log("isRecording", isRecording);
  return (
    <View flex={1} className="flex-1 justify-center items-center">
      <Recorder isRecording={isRecording} setIsRecording={setIsRecording} />
      <TTSPlayer />
    </View>
  );
}
