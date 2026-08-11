import { Injectable } from '@nestjs/common';
import {
  JwtService as NestJwtService,
} from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Injectable()
export class JwtService {

  constructor(
    private readonly jwt: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: object) {
    const expiresIn =
      this.configService.getOrThrow<string>(
        'JWT_ACCESS_TOKEN_EXPIRES',
      ) as StringValue;

    return this.jwt.signAsync(payload, {
      expiresIn,
    });
  }

  async generateRefreshToken(payload: object) {
    const expiresIn =
      this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_EXPIRES',
      ) as StringValue;

    return this.jwt.signAsync(payload, {
      expiresIn,
    });
  }

  async verifyAccessToken(token: string) {
    return this.jwt.verifyAsync(token, {
      algorithms: ['RS256'],
    });
  }

  async verifyRefreshToken(token: string) {
    return this.jwt.verifyAsync(token, {
      algorithms: ['RS256'],
    });
  }
}