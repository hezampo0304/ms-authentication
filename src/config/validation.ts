import * as Joi from 'joi';

export const validationSchema = Joi.object({

  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),

  JWT_ACCESS_TOKEN_EXPIRES: Joi.string().default('15m'),

  JWT_REFRESH_TOKEN_EXPIRES: Joi.string().default('7d'),

  JWT_REFRESH_TOKEN_EXPIRATION_MS:
    Joi.number().default(604800000),

  BCRYPT_SALT_ROUNDS:
    Joi.number().default(12),

});