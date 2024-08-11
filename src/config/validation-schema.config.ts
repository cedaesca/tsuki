import * as Joi from '@hapi/joi';

const databaseValidationSchema = {
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().allow(''),
  DB_NAME: Joi.string().required(),
};

const discordValidationSchema = {
  BOT_SECRET: Joi.string().required(),
  BOT_CLIENT_ID: Joi.string().required(),
  GUILD_ID: Joi.string().required(),
  REFRESH_COMMANDS_ON_START: Joi.boolean().default(false),
};

const riotValidationSchema = {
  RIOT_API_KEY: Joi.string().required(),
};

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  ...discordValidationSchema,
  ...databaseValidationSchema,
  ...riotValidationSchema,
});
