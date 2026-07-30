import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantEntity } from '../entities/tenant.entity';
import { TenantMapper } from '../mappers/tenant.mapper';
import { EmailAlreadyExistsException } from 'src/common/exceptions/user/email-already-exists.exception';

@Injectable()
export class TenantRepository {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findBySlug(slug: string): Promise<TenantEntity | null> {

    const tenant = await this.prisma.tenant.findUnique({
      where: {
        slug,
      },
    });

    return tenant ? TenantMapper.toEntity(tenant) : null;
  }

  async create(dto: CreateTenantDto): Promise<TenantEntity> {

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        type: dto.type,
        email: dto.email,
        phone: dto.phone,
      },
    });

    return TenantMapper.toEntity(tenant);
  }
}