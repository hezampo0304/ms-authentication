import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantEntity } from '../entities/tenant.entity';
import { TenantRepository } from '../repositories/tenant.repository';

@Injectable()
export class TenantService {

  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async registerTenant(
    dto: CreateTenantDto,
  ): Promise<TenantEntity> {

    const exists = await this.tenantRepository.findBySlug(dto.slug);

    if (exists) {
      throw new ConflictException(
        'The tenant slug is already registered.',
      );
    }

    return this.tenantRepository.create(dto);
  }

}