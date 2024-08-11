import { Injectable } from '@nestjs/common';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';

@Injectable()
export class PingCommand implements Command {
  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Pong!');
  }

  public getData(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Responde con "Pong!"');
  }
}
