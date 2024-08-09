import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface BasicCommand {
  execute(interaction: CommandInteraction): Promise<void>;
  getData(): SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
}
