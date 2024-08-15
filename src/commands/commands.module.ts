import { Module } from '@nestjs/common';
import { PingModule } from './ping/ping.module';
import { CommandsService } from './commands.service';
import { COMMANDS } from './constants/general-constants';
import { DiscoveryModule } from '@nestjs/core';
import { CommandDiscoveryService } from './command-discovery.service';
import { Command } from './interfaces/command.interface';

@Module({
  exports: [CommandsService],
  imports: [DiscoveryModule, PingModule],
  providers: [
    CommandsService,
    CommandDiscoveryService,
    {
      provide: COMMANDS,
      useFactory: (
        commandDiscoveryService: CommandDiscoveryService,
      ): Command[] => {
        return commandDiscoveryService.discoverCommands();
      },
      inject: [CommandDiscoveryService],
    },
  ],
})
export class CommandsModule {}
