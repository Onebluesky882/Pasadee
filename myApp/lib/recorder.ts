import { Audio } from "expo-av";
import { API } from "./api"; // axios instance

let recording: Audio.Recording | null = null;
let isRecording = false;

const recordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".caf",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

export async function record() {
  if (isRecording) return;
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    recording = new Audio.Recording();
    await recording.prepareToRecordAsync(recordingOptions);
    await recording.startAsync();
    isRecording = true;
    console.log("Recording started...");
  } catch (err) {
    console.error("Failed to start recording:", err);
  }
}

export async function stopRecording(): Promise<File | null> {
  if (!recording) return null;

  try {
    await recording.stopAndUnloadAsync();
    isRecording = false;

    const uri = recording.getURI();
    console.log("Recording stopped at", uri);

    if (!uri) return null;

    // แปลง URI → File object สำหรับส่งไป backend
    const response = await fetch(uri);
    const blob = await response.blob();
    const file = new File([blob], "recording.m4a", { type: "audio/m4a" });

    recording = null;
    return file;
  } catch (err) {
    console.error("Failed to stop recording:", err);
    return null;
  }
}

export const sendVoice = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/record-voice/stt-tts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  const audioUrl = URL.createObjectURL(res.data);
  return audioUrl;
};
