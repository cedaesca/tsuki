import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Command } from './interfaces/command.interface';
import { COMMANDS } from './commands.constants';

@Injectable()
export class CommandsService implements OnModuleInit {
  private commands = new Map<string, Command>();

  constructor(@Inject(COMMANDS) private readonly commandInstances: Command[]) {}

  onModuleInit() {
    this.organizeCommands();
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  private organizeCommands(): void {
    this.commandInstances.forEach((command) => {
      this.commands.set(command.data.name, command);
    });
  }
}
