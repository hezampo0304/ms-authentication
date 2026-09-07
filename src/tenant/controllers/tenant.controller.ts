import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get
} from '@nestjs/common';

import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantService } from '../services/tenant.service';
import { ResponseFactory } from 'src/common/response/response.factory';
import { TenantEntity } from '../entities/tenant.entity';

@Controller('/tenants')
export class TenantController {

  constructor(
    private readonly tenantService: TenantService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: CreateTenantDto,
  ) {

    const tenant =
      await this.tenantService.registerTenant(dto);

    return ResponseFactory.success(
      tenant,
      'Tenant registered successfully.',
    );
  }

  @Get('getAllTenants')
async getTenants(): Promise<TenantEntity[]> {
  return this.tenantService.getTenants();
}
}