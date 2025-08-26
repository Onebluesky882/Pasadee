import { AuthService } from '@mguay/nestjs-better-auth';
import { NestFactory } from '@nestjs/core';
import { toNodeHandler } from 'better-auth/node';
import { AppModule } from './app.module';

async function bootstrap() {
  // สร้าง Nest app โดยปิด body parser (Better Auth จะ handle เอง)
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Get express instance
  const expressApp = app.getHttpAdapter().getInstance();

  // ดึง AuthService
  const authService = app.get<AuthService>(AuthService);

  if (!authService?.instance) {
    throw new Error('AuthService instance not ready');
  }

  console.log('Mounting Better Auth /api/auth/* handler');

  // Mount Better Auth handler บน /api/auth/*
  expressApp.all(/^\/api\/auth\/.*/, (req, res) => {
    console.log('Better Auth handler called for:', req.url);
    toNodeHandler(authService.instance.handler)(req, res);
  });

  // Enable CORS สำหรับ localhost dev
  app.enableCors({
    origin: ['http://localhost:19006', 'http://localhost:8081'],
    credentials: true,
  });

  console.log('AuthService available:', !!authService);
  console.log('AuthService instance available:', !!authService?.instance);

  // Start server
  console.log('Server starting...');
  await app.listen(3001, 'localhost');
  console.log('Server running on http://localhost:3001');
}

bootstrap();
