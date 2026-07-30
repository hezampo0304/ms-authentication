import { Injectable, ConflictException } from '@nestjs/common';
import { Prisma, RefreshToken } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { RegisterTenantDto } from '../dto/register-tenant.dto';

import { PasswordService } from '../services/password.service';

import { AUTH_CONSTANTS } from 'src/common/constants';
import { ResponseCode, TenantResponses, UserResponses } from 'src/common/response';
import { REFRESH_TOKEN_EXPIRATION_MS } from '../constants/auth.constants';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async registerTenant(dto: RegisterTenantDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
         // Tenant
        const tenant = await tx.tenant.create({
          data: {
            name: dto.tenantName,
            slug: dto.slug,
            type: AUTH_CONSTANTS.TENANT_TYPES.TRAVEL_AGENCY,
            email: dto.admin.email,
          },
        }); 
        // User
        const user = await tx.user.create({
          data: {
            tenantId: tenant?.id,
            firstName: dto.admin.firstName,
            lastName: dto.admin.lastName,
            email: dto.admin.email,
            status: AUTH_CONSTANTS.USER_STATUS.ACTIVE,
          },
        });

        // Identity
        const identity = await tx.identity.create({
          data: {
            userId: user.id,
            provider: AUTH_CONSTANTS.PROVIDERS.LOCAL,
            identifier: dto.admin.email,
            verified: true,
          },
        });

        // Password
        const passwordHash = await this.passwordService.hash(
          dto.admin.password,
        );

        // Credential
        await tx.credential.create({
          data: {
            identityId: identity.id,
            type: AUTH_CONSTANTS.CREDENTIAL_TYPES.PASSWORD,
            passwordHash,
          },
        });

        return {
          tenantId: tenant.id,
          userId: user.id,
        };
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target as string[] | undefined;

        if (target?.includes('slug')) {
          throw new ConflictException({
            code: TenantResponses.ALREADY_EXISTS.code,
            message: `The tenant slug '${dto.slug}' is already registered.`,
          });
        }

        if (target?.includes('email')) {
          throw new ConflictException({
            code: UserResponses.EMAIL_ALREADY_EXISTS.code,
            message: `The email '${dto.admin.email}' is already registered.`,
          });
        }
      }

      throw error;
    }
  }

  async findIdentityByIdentifier(identifier: string) {
    return this.prisma.identity.findFirst({
      where: {
        identifier,
        provider: AUTH_CONSTANTS.PROVIDERS.LOCAL,
      },
      include: {
        user: {
          include: {
            tenant: true,
          },
        },
        credentials: true,
      },
    });
  }

  async createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.session.create({
      data: {
        userId,
        ipAddress,
        userAgent,
        isActive: true,
        expiresAt: new Date(
          Date.now() + REFRESH_TOKEN_EXPIRATION_MS,
        ),
      },
    });
  }

  async updateLogin(
    identityId: string,
    userId: string,
  ) {
    return this.prisma.$transaction([
      this.prisma.identity.update({
        where: {
          id: identityId,
        },
        data: {
          lastAuthenticatedAt: new Date(),
        },
      }),

      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          lastLoginAt: new Date(),
        },
      }),
    ]);
  }

  async saveRefreshToken(
    sessionId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    return this.prisma.refreshToken.create({
      data: {
        sessionId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async findSessionById(id: string) {
    return this.prisma.session.findUnique({
      where: {
        id,
      },
    });
  }

  async revokeSession(sessionId: string) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async revokeRefreshToken(id: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: {
        id,
      },
      data: {
        revoked: true,
      },
    });
  }

  async revokeRefreshTokensBySessionId(
  sessionId: string,
) {
  return this.prisma.refreshToken.updateMany({
    where: {
      sessionId,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });
}
}