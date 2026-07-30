import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {

  constructor(
    private readonly jwt: NestJwtService,
  ) {}

  async generateAccessToken(payload: object) {
    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(payload: object) {
    return this.jwt.signAsync(payload, {
      expiresIn: '7d',
    });
  }
}