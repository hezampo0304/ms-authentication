import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { createHash, randomUUID } from 'crypto';

import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { AuthRepository } from '../repositories/auth.repository';
import { JwtService } from './jwt.service';

import { AUTH_RESPONSE, USER_RESPONSE } from '../../common/constants';


@Injectable()
export class RefreshTokenService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    dto: RefreshTokenDto,
  ) {

    //1. Validar firma del JWT
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyRefreshToken(
        dto.refreshToken,
      );

    } catch {

      throw new UnauthorizedException(
        AUTH_RESPONSE.INVALID_REFRESH_TOKEN.toResponse(),
      );

    }

    // 2. Hashear el refresh token recibido
    const tokenHash = createHash('sha256')
      .update(dto.refreshToken)
      .digest('hex');

    // 3. Buscar el refresh token en BD
    const refreshToken =
      await this.authRepository.findRefreshTokenByHash(
        tokenHash,
      );

    if (!refreshToken) {

      throw new UnauthorizedException(
        AUTH_RESPONSE.INVALID_REFRESH_TOKEN.toResponse(),
      );

    }

    // 4. ¿Está revocado?
    if (refreshToken.revoked) {

      throw new UnauthorizedException(
        AUTH_RESPONSE.REFRESH_TOKEN_REVOKED.toResponse(),
      );

    }

    // 5. ¿Expiró?
    if (refreshToken.expiresAt < new Date()) {

      throw new UnauthorizedException(
        AUTH_RESPONSE.SESSION_EXPIRED.toResponse(),
      );

    }

    // 6. ¿La sesión sigue activa?
    if (!refreshToken.session.isActive) {

      throw new UnauthorizedException(
        AUTH_RESPONSE.SESSION_NOT_FOUND.toResponse(),
      );

    }

    // 7. Buscar usuario
    const user =
      await this.authRepository.findUserById(
        payload.sub,
      );

    if (!user) {

      throw new UnauthorizedException(
        USER_RESPONSE.NOT_FOUND.toResponse(),
      );

    }

    // 8. Nuevo payload
    const newPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      identityId: payload.identityId,
      email: payload.email,
      provider: payload.provider,
      sessionId: refreshToken.session.id,
      jti: randomUUID(),
    };

    // 9. Generar nuevos tokens
    const accessToken =
      await this.jwtService.generateAccessToken(
        newPayload,
      );

    const newRefreshToken =
      await this.jwtService.generateRefreshToken(
        newPayload,
      );

    // 10. Hash del nuevo refresh token
    const newTokenHash = createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');

    const expiresAt = new Date(
      Date.now() + (7 * 24 * 60 * 60 * 1000),
    );

    // 11. rotateRefreshToken
    await this.authRepository.rotateRefreshToken(
  refreshToken.id,
  refreshToken.session.id,
  newTokenHash,
  expiresAt,
);

    // 12. Respuesta
    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
    };

  }

}