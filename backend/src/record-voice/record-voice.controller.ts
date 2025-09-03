import {
  Controller,
  Get,
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

  @Get('test')
  async testKey() {
    try {
      const models = await this.client.models.list();
      return { ok: true, count: models.data.length };
    } catch (error) {
      return { ok: false, error: error.message };
    }
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

      const models = await this.client.models.list();
      console.log('✅ Token is valid. Available models:', models.data.length);
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
      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: 'whisper-1',
      });

      const tts = await this.client.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'alloy',
        input: transcription.text,
      });

      fs.unlinkSync(tempPath);
      const buffer = Buffer.from(await tts.arrayBuffer());
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `inline; filename="speech.mp3"`,
      });

      res.send(buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed STT → TTS' });
    }
  }
}
