import { Tenant } from '@prisma/client';
import { TenantEntity } from '../entities/tenant.entity';

export class TenantMapper {
  static toEntity(tenant: Tenant): TenantEntity {
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      email: tenant.email ?? undefined,
      phone: tenant.phone ?? undefined,
      type: tenant.type,
      status: tenant.status,
      logoUrl: tenant.logoUrl ?? undefined,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }
}