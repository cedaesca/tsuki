import { Module } from '@nestjs/common';
import { PingCommand } from './ping.command';

@Module({
  providers: [PingCommand],
  exports: [PingCommand],
})
export class PingModule {}
