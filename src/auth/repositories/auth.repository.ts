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
}