import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { CommandDiscoveryService } from './command-discovery.service';
import { IsCommand } from './decorators/is-command.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
@IsCommand()
class TestCommand1 {}

@Injectable()
@IsCommand()
class TestCommand2 {}

@Injectable()
class TestCommand3 {}

@Injectable()
@IsCommand()
class TestCommand4 {}

describe(CommandDiscoveryService.name, () => {
  let service: CommandDiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandDiscoveryService,
        DiscoveryService,
        Reflector,
        TestCommand1,
        TestCommand2,
        TestCommand3,
        TestCommand4,
      ],
    }).compile();

    service = module.get<CommandDiscoveryService>(CommandDiscoveryService);
  });

  it('should discover providers with @IsCommand decorator', () => {
    const commands = service.discoverCommands();
    expect(commands).toHaveLength(3);

    expect(commands[0].constructor.name).toBe(TestCommand1.name);
    expect(commands[1].constructor.name).toBe(TestCommand2.name);
    expect(commands[2].constructor.name).toBe(TestCommand4.name);
  });
});
