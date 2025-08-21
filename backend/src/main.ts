import { AuthService } from '@mguay/nestjs-better-auth';
import { NestFactory } from '@nestjs/core';
import { toNodeHandler } from 'better-auth/node';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  const expressApp = app.getHttpAdapter().getInstance();
  const authService = app.get<AuthService>(AuthService);

  // Mount BetterAuth first
  expressApp.all(
    /^\/api\/auth\/.*/,
    toNodeHandler(authService.instance.handler),
  );

  app.setGlobalPrefix('api');
  await app.listen(3000);
}

bootstrap();
