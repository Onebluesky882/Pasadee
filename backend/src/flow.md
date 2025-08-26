เยี่ยมครับ! เราจะทำเป็น ระบบสอนภาษาอังกฤษ แบบ MVP Speech-to-Text + TTS โดยใช้ Expo (frontend) และ NestJS (backend) กับ OpenAI API

ผมจะแบ่งเป็น Step-by-Step ชัดเจน พร้อมโค้ดตัวอย่าง

Step 1: Expo Frontend – รับเสียงจากผู้ใช้

1. ติดตั้ง dependencies

expo install expo-av expo-media-library expo-file-system


2. สร้าง Hook สำหรับบันทึกเสียง

import { useState } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
  };

  const stopRecording = async () => {
    if (!recording) return null;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    return uri; // ส่งไป backend
  };

  return { recording, startRecording, stopRecording };
};


3. ปุ่มบันทึกและส่งเสียง

import { View, Button } from 'react-native';
import { useAudioRecorder } from './useAudioRecorder';

export default function RecordScreen() {
  const { recording, startRecording, stopRecording } = useAudioRecorder();

  const sendAudio = async () => {
    const uri = await stopRecording();
    if (!uri) return;

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/mpeg',
      name: 'audio.mp3',
    } as any);

    const res = await fetch('http://localhost:3000/api/speech-to-text', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    console.log('Transcription:', data.text);
  };

  return (
    <View>
      <Button
        title={recording ? "Stop & Send" : "Start Recording"}
        onPress={recording ? sendAudio : startRecording}
      />
    </View>
  );
}

Step 2: NestJS Backend – รับไฟล์เสียง

1. ติดตั้ง dependencies

npm install @nestjs/platform-express multer openai


2. Controller

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenaiService } from './openai.service';

@Controller('speech-to-text')
export class SpeechController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async speechToText(@UploadedFile() file: Express.Multer.File) {
    return this.openaiService.speechToText(file);
  }
}

Step 3: OpenaiService – ส่งไฟล์เสียงไป OpenAI Whisper
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import fs from 'fs';

@Injectable()
export class OpenaiService {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async speechToText(file: Express.Multer.File) {
    try {
      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(file.path),
        model: 'whisper-1',
      });
      return { text: transcription.text };
    } catch (err) {
      console.error('postOpenAi error:', err);
      throw err;
    }
  }
}

Step 4: NestJS Backend – Optional TTS (Text-to-Speech)
async textToSpeech(text: string) {
  const response = await this.client.audio.speech.create({
    model: 'gpt-5o-mini-tts',
    voice: 'alloy',
    input: text,
  });
  return response; // ส่งกลับ mp3 ให้ frontend
}

Step 5: Frontend – เล่นเสียงจาก TTS
import { Audio } from 'expo-av';

const playAudio = async (arrayBuffer: ArrayBuffer) => {
  const { sound } = await Audio.Sound.createAsync(
    { uri: 'data:audio/mpeg;base64,' + Buffer.from(arrayBuffer).toString('base64') },
    { shouldPlay: true }
  );
};


✅ Flow สรุป:

ผู้ใช้กดปุ่มบันทึกเสียง → Expo บันทึกไฟล์ .mp3

ส่งไฟล์ไป NestJS → Controller → OpenaiService

ส่งไฟล์ไป Whisper → รับ transcription → ส่งกลับ frontend

(Optional) ส่งข้อความไป TTS → รับ mp3 → เล่นบน Expo