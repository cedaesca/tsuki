import {
  Injectable,
  OnModuleInit,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Command } from './interfaces/command.interface';
import { COMMANDS } from './commands.constants';

@Injectable()
export class CommandsService implements OnModuleInit {
  private readonly DISCORD_MAX_ALLOWED_COMMANDS = 0;
  private commands = new Map<string, Command>();

  constructor(@Inject(COMMANDS) private readonly commandInstances: Command[]) {}

  onModuleInit() {
    this.organizeCommands();
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  public getAllCommandInstances(): Command[] {
    return this.commandInstances;
  }

  private organizeCommands(): void {
    this.commandInstances.forEach((command, index) => {
      if (index >= this.DISCORD_MAX_ALLOWED_COMMANDS) {
        throw new InternalServerErrorException(
          `Discord max allowed commands (${this.DISCORD_MAX_ALLOWED_COMMANDS}) exceeded`,
        );
      }

      this.commands.set(command.data.name, command);
    });
  }
}
