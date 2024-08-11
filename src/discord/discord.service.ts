import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, CommandInteraction, Events, REST, Routes } from 'discord.js';
import { CommandsService } from '../commands/commands.service';

@Injectable()
export class DiscordService {
  private readonly guildId = this.configService.get('GUILD_ID');
  private readonly botToken = this.configService.get('BOT_SECRET');
  private readonly botClientId = this.configService.get('BOT_CLIENT_ID');
  private readonly shouldRefreshComands = this.configService.get<boolean>(
    'REFRESH_COMMANDS_ON_START',
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: ConsoleLogger,
    private readonly client: Client,
    private readonly restClient: REST,
    private readonly commandsService: CommandsService,
  ) {
    this.logger.setContext(DiscordService.name);
  }

  public async init(): Promise<void> {
    this.client.on(Events.ClientReady, () => {
      this.logger.log(`Logged in as ${this.client.user.tag}!`);
    });

    if (this.shouldRefreshComands) {
      this.registerCommands();
    }

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isCommand()) {
        return;
      }

      this.handleCommandInteraction(interaction);
    });

    await this.client.login(this.botToken);
  }

  private handleCommandInteraction(interaction: CommandInteraction) {
    const { commandName } = interaction;
    const command = this.commandsService.getCommand(commandName);

    command.execute(interaction);
  }

  private async registerCommands() {
    const commands = this.commandsService.getAllCommandInstances();
    const mappedCommandsData = commands.map((command) =>
      command.getData().toJSON(),
    );

    this.logger.log(
      `Refreshing ${mappedCommandsData.length} application commands`,
    );

    const data = (await this.restClient.put(
      Routes.applicationGuildCommands(this.botClientId, this.guildId),
      { body: mappedCommandsData },
    )) as any[];

    this.logger.log(
      `Successfully reloaded ${data.length} application commands`,
    );
  }
}
