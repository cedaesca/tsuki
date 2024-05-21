import { Test, TestingModule } from '@nestjs/testing';
import { PingCommand } from './ping.command';
import { CommandInteraction } from 'discord.js';

describe('PingCommand', () => {
  let command: PingCommand;
  let interaction: CommandInteraction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingCommand],
    }).compile();

    command = module.get<PingCommand>(PingCommand);

    interaction = {
      reply: jest.fn().mockResolvedValue(undefined),
    } as unknown as CommandInteraction;
  });

  it('should reply with "Pong!"', async () => {
    await command.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith('Pong!');
  });
});
