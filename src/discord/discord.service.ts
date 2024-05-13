import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Events } from 'discord.js';

@Injectable()
export class DiscordService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: ConsoleLogger,
    private readonly client: Client,
  ) {
    this.logger.setContext(DiscordService.name);
  }

  public async init(): Promise<void> {
    this.client.on(Events.ClientReady, () => {
      this.logger.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isCommand()) {
        return;
      }

      const { commandName } = interaction;

      this.logger.log(`Command received: ${commandName}`);
    });

    await this.client.login(this.configService.get<string>('BOT_SECRET'));
  }
}
