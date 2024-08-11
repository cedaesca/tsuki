import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import {
  Client,
  CommandInteraction,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger } from '@nestjs/common';
import { CommandsService } from '../commands/commands.service';
import { Command } from 'src/commands/interfaces/command.interface';

jest.mock('discord.js', () => {
  const actualDiscordJs = jest.requireActual('discord.js');
  return {
    ...actualDiscordJs,
    Client: jest.fn(() => ({
      on: jest.fn(),
      login: jest.fn(),
      user: {
        tag: 'test-bot-tag',
      },
      emit: jest.fn(),
    })),
  };
});

describe('DiscordService', () => {
  let service: DiscordService;
  let client: jest.Mocked<Client>;
  let configService: ConfigService;
  let logger: ConsoleLogger;
  let commandsService: CommandsService;

  const getDiscordEventHandler = (eventName) => {
    return client.on.mock.calls.find(([event]) => event === eventName)[1];
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
        {
          provide: Client,
          useValue: new Client({
            intents: [
              GatewayIntentBits.Guilds,
              GatewayIntentBits.GuildMessages,
            ],
          }),
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-bot-token'),
          },
        },
        {
          provide: ConsoleLogger,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
          },
        },
        {
          provide: CommandsService,
          useValue: {
            getCommand: jest.fn().mockReturnValue({
              execute: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
    client = module.get<Client>(Client) as jest.Mocked<Client>;
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<ConsoleLogger>(ConsoleLogger);
    commandsService = module.get<CommandsService>(CommandsService);

    await service.init();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('on init', () => {
    it('should login on init, using secret from env variables', async () => {
      expect(client.login).toHaveBeenCalledWith('test-bot-token');
      expect(configService.get).toHaveBeenCalledWith('BOT_SECRET');
    });

    it('should register a listener for commands interaction', async () => {
      expect(client.on).toHaveBeenCalledWith(
        Events.InteractionCreate,
        expect.any(Function),
      );
    });

    it('should log an info message on login', async () => {
      const clientReadyHandler = getDiscordEventHandler(Events.ClientReady);
      await clientReadyHandler();

      expect(logger.log).toHaveBeenCalledWith('Logged in as test-bot-tag!');
    });
  });

  describe('on interaction received', () => {
    it('should not do anything if the interaction is not a command', async () => {
      const interaction = {
        isCommand: jest.fn().mockReturnValue(false),
      } as unknown as CommandInteraction;

      const interactionHandler = getDiscordEventHandler(
        Events.InteractionCreate,
      );
      await interactionHandler(interaction);

      expect(interaction.isCommand).toHaveBeenCalled();
      expect(commandsService.getCommand).not.toHaveBeenCalled();
    });

    it('should fetch and execute the command if it’s a valid one', async () => {
      const executeSpy = jest.fn();

      const interaction = {
        isCommand: jest.fn().mockReturnValue(true),
        commandName: 'testCommand',
        reply: jest.fn().mockResolvedValue(undefined),
      } as unknown as CommandInteraction;

      const mockCommand = {
        data: { name: 'testCommand' },
        execute: executeSpy,
      };

      jest
        .spyOn(commandsService, 'getCommand')
        .mockReturnValue(mockCommand as unknown as Command);

      const interactionHandler = getDiscordEventHandler(
        Events.InteractionCreate,
      );
      await interactionHandler(interaction);

      expect(interaction.isCommand).toHaveBeenCalled();
      expect(commandsService.getCommand).toHaveBeenCalledWith('testCommand');
      expect(executeSpy).toHaveBeenCalledWith(interaction);
    });
  });
});
