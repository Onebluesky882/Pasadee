import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { OpenAI } from 'openai';
import * as path from 'path';
@Controller('record-voice')
export class RecordVoiceController {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      console.log('No file received');
      return { error: 'no file uploaded' };
    }

    const tempPath = path.join(process.cwd(), file.originalname);
    fs.writeFileSync(tempPath, file.buffer);

    try {
      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: 'whisper-1',
      });

      fs.unlinkSync(tempPath);

      return {
        text: transcription.text,
      };
    } catch (error) {
      console.error(error);
      return { error: 'filed to transcribe' };
    }
  }

  @Post('stt-tts')
  @UseInterceptors(FileInterceptor('file'))
  async recordAndSpeak(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(400).json({ error: 'no file uploaded' });
    }

    const tempPath = path.join(process.cwd(), file.originalname);
    fs.writeFileSync(tempPath, file.buffer);

    try {
      console.time('transcription');
      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: 'whisper-1',
        prompt:
          'Please transcribe only in English. Do not respond in Thai or other languages.',
      });
      console.timeEnd('transcription');

      // 1️⃣ Chat completion ด้วย gpt-5-nano
      console.time('chat');
      const chat = await this.client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content: `
You are Sara, an English-speaking friend.
Talk naturally, short sentences, respond only to the user.
 
      `,
          },
          {
            role: 'user',
            content: transcription.text, // ใส่ประโยคผู้เรียน
          },
        ],
      });

      const aiText = chat.choices[0].message?.content;
      console.timeEnd('chat');

      console.time('tts');
      const tts = await this.client.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        input: aiText!, // <-- use 'input', not 'message' or 'messages'
        voice: 'alloy',
      });

      fs.unlinkSync(tempPath);
      const buffer = Buffer.from(await tts.arrayBuffer());
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `inline; filename="speech.mp3"`,
      });

      res.send(buffer);
      console.timeEnd('tts');
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed STT → TTS' });
    }
  }
}
