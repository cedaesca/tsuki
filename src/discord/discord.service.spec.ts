import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import {
  Client,
  CommandInteraction,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
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
    REST: jest.fn(() => ({
      put: jest.fn(),
    })),
  };
});

const createMockCommand = (name: string, description: string): Command => {
  return {
    execute: () => null,
    getData: () =>
      new SlashCommandBuilder().setName(name).setDescription(description),
  };
};

describe(DiscordService.name, () => {
  let service: DiscordService;
  let client: jest.Mocked<Client>;
  let restClient: jest.Mocked<REST>;
  let configService: ConfigService;
  let logger: ConsoleLogger;
  let commandsService: CommandsService;

  const testCommands = [
    createMockCommand('command1', 'command1desc'),
    createMockCommand('command2', 'command2desc'),
    createMockCommand('command3', 'command3desc'),
  ];

  const botToken = 'test-bot-token';
  const clientId = 'test-client-id';
  const guildId = 'test-guild-id';

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
          provide: REST,
          useValue: new REST(),
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'REFRESH_COMMANDS_ON_START':
                  return false;
                case 'BOT_SECRET':
                  return botToken;
                case 'BOT_CLIENT_ID':
                  return clientId;
                case 'GUILD_ID':
                  return guildId;
                default:
                  return 'test-value';
              }
            }),
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
            getAllCommandInstances: jest.fn().mockReturnValue(testCommands),
          },
        },
      ],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
    client = module.get<Client>(Client) as jest.Mocked<Client>;
    restClient = module.get<REST>(REST) as jest.Mocked<REST>;
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<ConsoleLogger>(ConsoleLogger);
    commandsService = module.get<CommandsService>(CommandsService);

    await service.init();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('on init', () => {
    it('should login on init, using secret from env variables', () => {
      expect(client.login).toHaveBeenCalledWith('test-bot-token');
      expect(configService.get).toHaveBeenCalledWith('BOT_SECRET');
    });

    it('should register a listener for commands interaction', () => {
      expect(client.on).toHaveBeenCalledWith(
        Events.InteractionCreate,
        expect.any(Function),
      );
    });

    it('should log an info message on login', () => {
      const clientReadyHandler = getDiscordEventHandler(Events.ClientReady);

      clientReadyHandler();

      expect(logger.log).toHaveBeenCalledWith('Logged in as test-bot-tag!');
    });

    it('should refresh commands if shouldRefreshCommands is true', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'REFRESH_COMMANDS_ON_START') return true;
        return 'test-bot-token';
      });

      jest.spyOn(restClient, 'put').mockResolvedValue(testCommands);

      await service.init();

      expect(restClient.put).toHaveBeenCalled();

      expect(restClient.put).toHaveBeenCalledWith(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: testCommands.map((command) => command.getData().toJSON()) },
      );
    });
  });

  describe('on interaction received', () => {
    it('should not do anything if the interaction is not a command', () => {
      const interaction = {
        isCommand: jest.fn().mockReturnValue(false),
      } as unknown as CommandInteraction;

      const interactionHandler = getDiscordEventHandler(
        Events.InteractionCreate,
      );

      interactionHandler(interaction);

      expect(interaction.isCommand).toHaveBeenCalled();
      expect(commandsService.getCommand).not.toHaveBeenCalled();
    });

    it('should fetch and execute the command if it’s a valid one', () => {
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

      interactionHandler(interaction);

      expect(interaction.isCommand).toHaveBeenCalled();
      expect(commandsService.getCommand).toHaveBeenCalledWith('testCommand');
      expect(executeSpy).toHaveBeenCalledWith(interaction);
    });
  });
});
