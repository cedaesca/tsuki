import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DiscordService } from './discord/discord.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const discordService = app.get(DiscordService);

  discordService.init();
}
bootstrap();
