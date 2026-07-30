import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessTokenExpiresIn:
      process.env.JWT_ACCESS_TOKEN_EXPIRES ?? '15m',

    refreshTokenExpiresIn:
      process.env.JWT_REFRESH_TOKEN_EXPIRES ?? '7d',

    refreshTokenExpirationMs:
      parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS ??
          '604800000',
        10,
      ),
  },

  bcrypt: {
    saltRounds: parseInt(
      process.env.BCRYPT_SALT_ROUNDS ?? '12',
      10,
    ),
  },
}));