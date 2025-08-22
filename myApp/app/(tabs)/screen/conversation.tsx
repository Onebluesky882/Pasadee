import { TeacherSVG } from "@/components/lottie";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Box, Pressable, SafeAreaView } from "@gluestack-ui/themed";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
const conversation = () => {
  /* 
  Plan (MVP push-to-talk)

Expo records voice (press & hold or tap).

Upload audio file (m4a) to NestJS via FormData.

NestJS → transcribe (Whisper / gpt-4o-mini-transcribe).

NestJS → send transcript to OpenAI (system prompt = “English teacher”).

(Optional) NestJS → TTS to MP3 (voice reply).

Expo shows teacher text + plays audio reply.
  

*/
  // video synclabs.so

  const [uri, setUri] = useState<string | null>(null);
  const [openMic, setOpenMic] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    const startRecordAudio = async () => {
      await Audio.requestPermissionsAsync();
    };
    startRecordAudio();
  }, [recording]);

  // toggle open / close
  const toggleOpenMic = () => {
    setOpenMic(() => !openMic);
  };

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      });

      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  async function stopRecording() {
    console.log("Stopping recording..");
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setUri(uri);
    console.log("Recording stopped and stored at", uri);
    setRecording(null);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box className="flex-1">
        <Box className="flex-1 bg-gray-200">
          <TeacherSVG />

          <Box className="flex items-center p-2">
            <Pressable onPress={toggleOpenMic}>
              <FontAwesome
                name="microphone"
                size={30}
                color={openMic ? "white" : "black"}
                className={`${
                  openMic && "border-white bg-blue-600"
                } border  rounded-full m-1 px-5 py-4`}
              />
            </Pressable>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
};
export default conversation;
