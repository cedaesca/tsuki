import { Module } from '@nestjs/common';
import { PingModule } from './ping/ping.module';
import { CommandsService } from './commands.service';
import { COMMAND_METADATA, COMMANDS } from './constants/general-constants';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';

@Module({
  exports: [CommandsService],
  imports: [DiscoveryModule, PingModule],
  providers: [
    CommandsService,
    {
      provide: COMMANDS,
      // We use reflector to automatically discover
      // our commands that are marked with the @IsCommand
      // decorator inside the imported command Modules.
      useFactory: (
        discoveryService: DiscoveryService,
        reflector: Reflector,
      ) => {
        const providers = discoveryService.getProviders();

        const commands = providers
          .map((wrapper) => wrapper.instance)
          .filter(
            (instance) =>
              instance && reflector.get(COMMAND_METADATA, instance.constructor),
          );

        return commands;
      },
      inject: [DiscoveryService, Reflector],
    },
  ],
})
export class CommandsModule {}
