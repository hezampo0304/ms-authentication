import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterTenantDto } from '../dto/register-tenant.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async registerTenant(dto: RegisterTenantDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName,
          slug: dto.slug,
          type: 'TRAVEL_AGENCY',
          email: dto.admin.email,
        },
      });

      // 2. Crear Usuario
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          firstName: dto.admin.firstName,
          lastName: dto.admin.lastName,
          displayName: `${dto.admin.firstName} ${dto.admin.lastName}`,
          email: dto.admin.email,
          status: 'ACTIVE',
        },
      });

      // 3. Crear Identity
      const identity = await tx.identity.create({
        data: {
          userId: user.id,
          provider: 'LOCAL',
          identifier: dto.admin.email,
          verified: true,
        },
      });

      // 4. Hashear contraseña
      const passwordHash = await bcrypt.hash(dto.admin.password, 12);

      // 5. Crear Credential
      await tx.credential.create({
        data: {
          identityId: identity.id,
          type: 'PASSWORD',
          passwordHash,
        },
      });

      return {
        tenantId: tenant.id,
        userId: user.id,
      };
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
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ),
    },
  });
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

async findIdentityByIdentifier(identifier: string) {
  return this.prisma.identity.findFirst({
    where: {
      identifier,
      provider: 'LOCAL',
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
async revokeRefreshToken(id: string) {
  return this.prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}
}