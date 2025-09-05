import { AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database/database-connection';
import { DatabaseModule } from './database/database.module';
import { OpenaiModule } from './openai/openai.module';
import { VoiceGateway } from './voice-stream/voice.gateway';
import { VoiceAzureGateway } from './voice-azure/voice-azure.gateway';
import { VoiceAzureService } from './voice-azure/voice-azure.service';
@Module({
  imports: [
    OpenaiModule,
    ConfigModule.forRoot(),
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

          // iphone simulator
          // my ip : 192.168.1.53
          trustedOrigins: ['http://192.168.1.49:3000'],
        }),
      }),
      inject: [DATABASE_CONNECTION],
    }),
  ],
  providers: [VoiceGateway, VoiceGateway, VoiceAzureGateway, VoiceAzureService],
})
export class AppModule {}
