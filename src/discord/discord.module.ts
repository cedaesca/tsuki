import { ConsoleLogger, Module } from '@nestjs/common';
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
    ConsoleLogger,
  ],
  exports: [DiscordService],
})
export class DiscordModule {}
