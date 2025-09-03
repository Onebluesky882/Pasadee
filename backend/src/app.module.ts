import { AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database/database-connection';
import { DatabaseModule } from './database/database.module';
import { RecordVoiceController } from './record-voice/record-voice.controller';
import { RecordVoiceService } from './record-voice/record-voice.service';
import { RecordVoiceModule } from './record-voice/record-voice.module';
@Module({
  imports: [
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
          trustedOrigins: ['http://192.168.1.53:3000'],
        }),
      }),
      inject: [DATABASE_CONNECTION],
    }),
    RecordVoiceModule,
  ],
  controllers: [RecordVoiceController],
  providers: [RecordVoiceService],
})
export class AppModule {}
