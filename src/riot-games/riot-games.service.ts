import { Injectable } from '@nestjs/common';
import { RiotApi } from 'twisted';
import { RegionGroups } from 'twisted/dist/constants';
import { AccountDto } from 'twisted/dist/models-dto/account/account.dto';

@Injectable()
export class RiotGamesService {
  constructor(private readonly riotClient: RiotApi) {}

  public async getAccountByRiotId(
    gameName: string,
    tagLine: string,
  ): Promise<AccountDto> {
    const request = await this.riotClient.Account.getByRiotId(
      gameName,
      tagLine,
      RegionGroups.AMERICAS,
    );

    return request.response;
  }
}
