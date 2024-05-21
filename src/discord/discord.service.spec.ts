import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import { Client } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger } from '@nestjs/common';
import { CommandsService } from '../commands/commands.service';

describe('DiscordService', () => {
  let service: DiscordService;
  let client: jest.Mocked<Client>;
  let configService: ConfigService;
  let logger: ConsoleLogger;
  let commandsService: CommandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
        {
          provide: Client,
          useValue: jest.fn(() => ({
            on: jest.fn(),
            login: jest.fn(),
          })),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
