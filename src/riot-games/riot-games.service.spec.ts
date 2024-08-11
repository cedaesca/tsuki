import { Test, TestingModule } from '@nestjs/testing';
import { RiotGamesService } from './riot-games.service';

describe('RiotGamesService', () => {
  let service: RiotGamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiotGamesService],
    }).compile();

    service = module.get<RiotGamesService>(RiotGamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
