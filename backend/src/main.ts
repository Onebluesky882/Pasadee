import { AuthService } from '@mguay/nestjs-better-auth';
import { NestFactory } from '@nestjs/core';
import { toNodeHandler } from 'better-auth/node';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  const expressApp = app.getHttpAdapter().getInstance();
  const authService = app.get<AuthService>(AuthService);

  console.log('AuthService available:', !!authService);
  console.log('AuthService instance available:', !!authService?.instance);
  // Mount BetterAuth first
  expressApp.all(
    /^\/api\/auth\/.*/,
    toNodeHandler(authService.instance.handler),
  );

  app.setGlobalPrefix('api');

  console.log('Server starting...');
  await app.listen(3001, '0.0.0.0');
  console.log('Server running on http://0.0.0.0:3001');
}

bootstrap();
