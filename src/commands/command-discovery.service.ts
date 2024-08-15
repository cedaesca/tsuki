import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { IS_COMMAND_METAKEY } from './constants/general-constants';
import { Command } from './interfaces/command.interface';

@Injectable()
export class CommandDiscoveryService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  public discoverCommands(): Command[] {
    const providers = this.discoveryService.getProviders();

    const providerInstances = providers.map((wrapper) => wrapper.instance);

    const commandInstances = providerInstances.filter((instance) => {
      if (!instance) {
        return;
      }

      return this.reflector.get(IS_COMMAND_METAKEY, instance.constructor);
    });

    return commandInstances;
  }
}
