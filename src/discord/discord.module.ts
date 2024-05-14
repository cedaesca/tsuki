import { ConsoleLogger, Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { Client, GatewayIntentBits } from 'discord.js';
import { CommandsModule } from 'src/commands/commands.module';

@Module({
  exports: [DiscordService],
  imports: [CommandsModule],
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
})
export class DiscordModule {}
