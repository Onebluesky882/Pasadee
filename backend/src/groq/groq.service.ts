import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private groq: Groq;

  OnModuleInit() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('❌ No GROQ_API_KEY found in environment!');
    }
    this.groq = new Groq({ apiKey });
  }
  get client() {
    return this.groq;
  }
}
