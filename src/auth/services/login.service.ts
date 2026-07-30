import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { createHash } from 'crypto';

import { LoginDto } from '../dto/login.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { PasswordService } from './password.service';
import { JwtService } from './jwt.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Buscar identidad
    const identity = await this.authRepository.findIdentityByIdentifier(
      dto.email,
    );
    console.log(`resultado de la busqueda por identidad ${identity?.id}`);
    if (!identity) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Buscar credencial PASSWORD
    const credential = identity.credentials.find(
      (credential) => credential.type === 'PASSWORD',
    );

    if (!credential || !credential.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validar contraseña
    const validPassword = await this.passwordService.compare(
      dto.password,
      credential.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validar estado del usuario
    if (identity.user.status !== 'ACTIVE') {
      throw new ForbiddenException(
        'User account is not active',
      );
    }

    // Crear sesión
    const session = await this.authRepository.createSession(
      identity.user.id,
      ipAddress,
      userAgent,
    );

    // Payload JWT
    const payload = {
      sub: identity.user.id,
      tenantId: identity.user.tenantId,
      identityId: identity.id,
      email: identity.identifier,
      provider: identity.provider,
      sessionId: session.id,
    };

    // Generar tokens
    const accessToken =
      await this.jwtService.generateAccessToken(payload);

    const refreshToken =
      await this.jwtService.generateRefreshToken(payload);

    // Guardar hash del Refresh Token
    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const refreshTokenExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
    );
    await this.authRepository.saveRefreshToken(
      session.id,
      refreshTokenHash,
      refreshTokenExpiresAt
    );

    // Actualizar fechas de login
    await this.authRepository.updateLogin(
      identity.id,
      identity.user.id,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }
}