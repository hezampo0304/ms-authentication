import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {

  constructor(
    private readonly jwt: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: object) {
    return this.jwt.signAsync(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES'),
    });
  }

  async generateRefreshToken(payload: object) {
    return this.jwt.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES'),
    });
  }

  async verifyAccessToken(token: string) {
    return this.jwt.verifyAsync(token);
  }
}