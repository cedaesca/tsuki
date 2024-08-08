import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './discord/discord.module';
import { CommandsModule } from './commands/commands.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        BOT_SECRET: Joi.string().required(),
        BOT_CLIENT_ID: Joi.string().required(),
        GUILD_ID: Joi.string().required(),
        REFRESH_COMMANDS_ON_START: Joi.boolean().default(false),
      }),
    }),
    DiscordModule,
    CommandsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
