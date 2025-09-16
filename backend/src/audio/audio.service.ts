import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class AudioService {
  async saveChunk(sessionId: string, seq: number, chunkBase64: string) {
    const buffer = Buffer.from(chunkBase64, 'base64');
    const dir = path.join(__dirname, '..', 'upload', sessionId);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `chunk-${seq}.m4a`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }
}
