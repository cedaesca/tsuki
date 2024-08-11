import { Module } from '@nestjs/common';
import { RiotGamesService } from './riot-games.service';
import { RiotApi } from 'twisted';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    RiotGamesService,
    {
      provide: RiotApi,
      useFactory: (configService: ConfigService) => {
        const riotApiKey = configService.get<string>('RIOT_API_KEY');

        return new RiotApi({ key: riotApiKey });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RiotGamesService],
})
export class RiotGamesModule {}
