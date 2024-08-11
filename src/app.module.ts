import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordModule } from './discord/discord.module';
import { CommandsModule } from './commands/commands.module';
import { RiotGamesModule } from './riot-games/riot-games.module';
import { validationSchema } from './config/validation-schema.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize:
          configService.get<string>('NODE_ENV') === 'production'
            ? false
            : configService.get('DB_SYNC'),
      }),
    }),
    DiscordModule,
    CommandsModule,
    RiotGamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
