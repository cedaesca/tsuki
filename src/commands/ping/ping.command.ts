import { Injectable } from '@nestjs/common';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';

@Injectable()
export class PingCommand implements Command {
  public readonly data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .setDescriptionLocalization('es-419', 'Responde con Pong!');

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Pong!');
  }
}
