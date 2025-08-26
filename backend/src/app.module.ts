import { AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AppController } from './app.controller';
import { DATABASE_CONNECTION } from './database/database-connection';
import { DatabaseModule } from './database/database.module';
import { OpenaiModule } from './openai/openai.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    OpenaiModule,
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule],

      useFactory: (database: NodePgDatabase) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            enabled: true,
          },
          trustedOrigins: [
            'http://localhost:8001',
            'https://192.168.1.53:8081',
            'http://192.168.1.53:8081',
          ],
        }),
      }),
      inject: [DATABASE_CONNECTION],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
