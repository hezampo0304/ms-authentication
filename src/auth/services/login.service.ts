import {
  Injectable
} from '@nestjs/common';

import { createHash, randomUUID } from 'crypto';

import { LoginDto } from '../dto/login.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { PasswordService } from './password.service';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { AUTH_CONSTANTS } from 'src/common/constants/auth.constants';
import { InvalidCredentialsException } from 'src/common/exceptions/auth/invalid-credentials.exception';
import { UserInactiveException } from 'src/common/exceptions/auth/user-inactive.exception';
import { KafkaService } from 'src/infraestructure/kafka/kafka.service';
import { UserAuthenticatedEvent } from 'src/infraestructure/events/user-authenticated.event';

@Injectable()
export class LoginService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
  ) {}

  async execute(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Buscar identidad
    const identity =
      await this.authRepository.findIdentityByIdentifier(
        dto.email,
      );

    if (!identity) {
      throw new InvalidCredentialsException();
    }

    // Buscar credencial PASSWORD
    const credential = identity.credentials.find(
      (credential) =>
        credential.type ===
        AUTH_CONSTANTS.CREDENTIAL_TYPES.PASSWORD,
    );

    if (!credential || !credential.passwordHash) {
      throw new InvalidCredentialsException();
    }

    // Validar contraseña
    const validPassword =
      await this.passwordService.compare(
        dto.password,
        credential.passwordHash,
      );

    if (!validPassword) {
      throw new InvalidCredentialsException();
    }

    // Validar estado del usuario
    if (
      identity.user.status !==
      AUTH_CONSTANTS.USER_STATUS.ACTIVE
    ) {
      throw new UserInactiveException();
    }

    // Obtener roles del usuario
    const roles = identity.user.roles.map(
      (userRole) => userRole.role.name,
    );

    // Obtener permisos únicos de todos los roles
    const permissions = [
      ...new Set(
        identity.user.roles.flatMap(
          (userRole) =>
            userRole.role.permissions.map(
              (rolePermission) =>
                rolePermission.permission.name,
            ),
        ),
      ),
    ];

    // Crear sesión
    const session =
      await this.authRepository.createSession(
        identity.user.id,
        ipAddress,
        userAgent,
      );

    //aqui tengo que crear el evento Kafka para el login exitoso, con la información del usuario y la sesión creada
    const event: UserAuthenticatedEvent = {
      eventId: randomUUID(),
      eventType: 'USER_AUTHENTICATED',
      occurredAt: new Date().toISOString(),
      userId: identity.user.id,
      tenantId: identity.user.tenantId,
      sessionId: session.id,
      email: identity.user.email,
      firstName: identity.user.firstName,
      lastName: identity.user.lastName,
      ipAddress,
      userAgent,
      expiresAt: session.expiresAt.toISOString(),
      provider: identity.provider,
    };
    
        await this.kafkaService.publish(
          process.env.KAFKA_AUTH_EVENTS_TOPIC ??
            'auth.events',
          event,
        );


    // Payload JWT
    const payload = {
      sub: identity.user.id,
      tenantId: identity.user.tenantId,
      identityId: identity.id,
      email: identity.identifier,
      provider: identity.provider,
      sessionId: session.id,
      jti: randomUUID(),
      roles,
      permissions,
    };

    // Generar Access Token
    const accessToken =
      await this.jwtService.generateAccessToken(
        payload,
      );

    // Generar Refresh Token
    const refreshToken =
      await this.jwtService.generateRefreshToken(
        payload,
      );

    // Guardar hash del Refresh Token
    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const expirationMs =
      this.configService.get<number>(
        'auth.jwt.refreshTokenExpirationMs',
      )!;

    const refreshTokenExpiresAt = new Date(
      Date.now() + expirationMs,
    );

    await this.authRepository.saveRefreshToken(
      session.id,
      refreshTokenHash,
      refreshTokenExpiresAt,
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