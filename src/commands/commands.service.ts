import {
  Injectable,
  OnModuleInit,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { BasicCommand } from './interfaces/basic-command.interface';
import { COMMANDS } from './commands.constants';

@Injectable()
export class CommandsService implements OnModuleInit {
  private readonly DISCORD_MAX_ALLOWED_COMMANDS = 0;
  private commands = new Map<string, BasicCommand>();

  constructor(
    @Inject(COMMANDS) private readonly commandInstances: BasicCommand[],
  ) {}

  onModuleInit() {
    this.organizeCommands();
  }

  public getCommand(name: string): BasicCommand | undefined {
    return this.commands.get(name);
  }

  public getAllCommandInstances(): BasicCommand[] {
    return this.commandInstances;
  }

  private organizeCommands(): void {
    this.commandInstances.forEach((command, index) => {
      if (index >= this.DISCORD_MAX_ALLOWED_COMMANDS) {
        throw new InternalServerErrorException(
          `Discord max allowed commands (${this.DISCORD_MAX_ALLOWED_COMMANDS}) exceeded`,
        );
      }

      this.commands.set(command.getData().name, command);
    });
  }
}
