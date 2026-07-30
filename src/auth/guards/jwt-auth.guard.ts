import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

import { JwtService } from '../services/jwt.service';
import { AuthResponses, ResponseCode } from 'src/common/response';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context
      .switchToHttp()
      .getRequest<Request>();

    const authorization =
      request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException({
        code: AuthResponses.INVALID_CREDENTIALS.code,
        message: 'Authorization header is required.',
      });
    }

    const [scheme, token] =
      authorization.split(' ');

    if (
      scheme !== 'Bearer' ||
      !token
    ) {
      throw new UnauthorizedException({
        code: AuthResponses.INVALID_REFRESH_TOKEN.code,
        message: 'Invalid authorization header.',
      });
    }

    try {

      const payload =
        await this.jwtService.verifyAccessToken(
          token,
        );

      request['user'] = payload;

      return true;

    } catch {

      throw new UnauthorizedException({
        code: AuthResponses.USER_INACTIVE.code,
        message: 'Invalid or expired access token.',
      });

    }

  }
}