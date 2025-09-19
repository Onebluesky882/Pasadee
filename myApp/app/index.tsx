import { View } from "@gluestack-ui/themed";
import { useState } from "react";
import useSocketManager from "../hooks/useWebSocket";
import SocketTest from "../services/SocketTest";
export default function index() {
  useSocketManager();
  const [isRecording, setIsRecording] = useState(false);

  console.log("isRecording", isRecording);
  return (
    <View style={{ flex: 1 }}>
      <SocketTest />
    </View>
  );
}

// <View flex={1} className="flex-1 justify-center items-center">
//   <Recorder isRecording={isRecording} setIsRecording={setIsRecording} />
//   <TTSPlayer />
// </View>
