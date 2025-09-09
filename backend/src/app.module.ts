import { AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { DATABASE_CONNECTION } from './database/database-connection';
import { DatabaseModule } from './database/database.module';
import { VoiceStreamingModule } from './voice-streaming/voice-streaming.module';
import { WrtcGateway } from './wrtc/wrtc.gateway';
import { WrtcGatewayGateway } from './wrtc-gateway/wrtc-gateway.gateway';
import { WrtcGateway } from './wrtc/wrtc.gateway';
@Module({
  imports: [
    VoiceStreamingModule,
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
    VoiceStreamingModule,
    AiAgentModule,
  ],
  providers: [WrtcGateway, WrtcGatewayGateway],
})
export class AppModule {}
