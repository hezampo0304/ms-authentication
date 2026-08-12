import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionClient {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async validateSession(
    userId: string,
    tenantId: string,
    sessionId: string,
  ): Promise<boolean> {
    const baseUrl =
      this.configService.getOrThrow<string>(
        'MS_SESSION_URL',
      );

    const internalToken =
      this.configService.getOrThrow<string>(
        'INTERNAL_SERVICE_TOKEN',
      );

    const response = await fetch(
      `${baseUrl}/session/internal/validate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${internalToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tenantId,
          sessionId,
        }),
      },
    );

    if (!response.ok) {
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new UnauthorizedException(
          'Session is not valid.',
        );
      }

      throw new Error(
        `ms-session returned HTTP ${response.status}`,
      );
    }

    const data = await response.json();

    return data.valid === true;
  }
}