import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Events } from 'discord.js';
import { CommandsService } from 'src/commands/commands.service';

@Injectable()
export class DiscordService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: ConsoleLogger,
    private readonly client: Client,
    private readonly commandsService: CommandsService,
  ) {
    this.logger.setContext(DiscordService.name);
  }

  public async init(): Promise<void> {
    this.client.on(Events.ClientReady, () => {
      this.logger.log(`Logged in as ${this.client.user.tag}!`);
      this.registerCommands();
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isCommand()) {
        return;
      }

      const { commandName } = interaction;

      const command = this.commandsService.getCommand(commandName);

      command.execute(interaction);
    });

    await this.client.login(this.configService.get<string>('BOT_SECRET'));
  }

  private registerCommands() {
    const commands = this.commandsService.getAllCommands();

    commands.forEach((command) => {
      this.client.application.commands.create(command.data.toJSON());
    });
  }
}
