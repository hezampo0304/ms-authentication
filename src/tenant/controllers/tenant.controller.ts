import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantService } from '../services/tenant.service';

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

    return {
      success: true,
      message: 'Tenant registered successfully.',
      data: tenant,
    };
  }
}