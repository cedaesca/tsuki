import { Module } from '@nestjs/common';
import { PingModule } from './ping/ping.module';
import { PingCommand } from './ping/ping.command';
import { CommandsService } from './commands.service';
import { COMMANDS } from './constants/general-constants';

@Module({
  exports: [CommandsService],
  imports: [PingModule],
  providers: [
    CommandsService,
    {
      provide: COMMANDS,
      useFactory: (pingCommand: PingCommand) => {
        return [pingCommand];
      },
      inject: [PingCommand],
    },
  ],
})
export class CommandsModule {}
