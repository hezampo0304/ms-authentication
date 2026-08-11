import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AuthRepository } from '../repositories/auth.repository';
import { AuthResponses, ResponseCode } from 'src/common/response';

@Injectable()
export class LogoutService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(
    sessionId: string,
  ) {
    // Buscar la sesión
    const session =
      await this.authRepository.findSessionById(
        sessionId,
      );

      console.log('Session found:', session);

    if (!session) {
      throw new NotFoundException({
        code: AuthResponses.SESSION_NOT_FOUND.code,
        message: 'Session not found.',
      });
    }

    // Si ya está cerrada simplemente respondemos OK
    if (!session.isActive) {
      return {
        success: true,
        message: 'Session already closed.',
      };
    }

    // Revocar todos los Refresh Tokens
    await this.authRepository.revokeRefreshTokensBySessionId(
      sessionId,
    );

    // Desactivar la sesión
    await this.authRepository.revokeSession(
      sessionId,
    );

    return {
      success: true,
      message: 'Logout successful.',
    };
  }
}