import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('ping')
  getRoot() {
    return { ok: true };
  }
}
