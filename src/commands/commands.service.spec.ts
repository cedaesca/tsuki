import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService } from './commands.service';
import { Command } from './interfaces/command.interface';
import { SlashCommandBuilder } from 'discord.js';
import { COMMANDS } from './constants/general-constants';

const createMockCommand = (name: string, description: string): Command => {
  return {
    execute: () => null,
    getData: () =>
      new SlashCommandBuilder().setName(name).setDescription(description),
  };
};

describe(CommandsService.name, () => {
  let commandsService: CommandsService;
  let testCommands: Command[];

  beforeEach(async () => {
    testCommands = [
      createMockCommand('command1', 'command1desc'),
      createMockCommand('command2', 'command2desc'),
      createMockCommand('command3', 'command3desc'),
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandsService,
        {
          provide: COMMANDS,
          useValue: testCommands,
        },
      ],
    }).compile();

    commandsService = module.get<CommandsService>(CommandsService);
  });

  it('should be defined', () => {
    expect(commandsService).toBeDefined();
  });

  it('should return a command by name', () => {
    commandsService.onModuleInit();

    testCommands.forEach((command) => {
      expect(commandsService.getCommand(command.getData().name)).toBe(command);
    });
  });

  it('should return all commands', () => {
    const allCommands = commandsService.getAllCommandInstances();

    expect(allCommands).toEqual(expect.arrayContaining(testCommands));
    expect(allCommands.length).toBe(testCommands.length);
  });
});
