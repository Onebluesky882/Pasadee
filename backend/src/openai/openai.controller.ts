import { Public } from '@mguay/nestjs-better-auth';
import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
@Public()
@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post()
  async postOpenAi(@Body('prompt') prompt: string) {
    console.log('here');
    return this.openaiService.postOpenAi(prompt);
  }
}
