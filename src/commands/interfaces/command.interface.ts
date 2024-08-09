import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface Command {
  execute(interaction: CommandInteraction): Promise<void>;
  getData(): SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
}
