import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { Client, GatewayIntentBits } from 'discord.js';

@Module({
  providers: [
    DiscordService,
    {
      provide: Client,
      useValue: new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
      }),
    },
  ],
  exports: [DiscordService],
})
export class DiscordModule {}
