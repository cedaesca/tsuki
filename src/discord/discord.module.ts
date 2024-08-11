import { ConsoleLogger, Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { Client, GatewayIntentBits, REST } from 'discord.js';
import { CommandsModule } from 'src/commands/commands.module';
import { ConfigService } from '@nestjs/config';

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
    {
      provide: REST,
      useFactory: (configService: ConfigService) => {
        const botToken = configService.get('BOT_SECRET');

        return new REST().setToken(botToken);
      },
      inject: [ConfigService],
    },
    ConsoleLogger,
  ],
})
export class DiscordModule {}
