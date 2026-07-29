import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterTenantDto } from '../dto/register-tenant.dto';
import { RegisterTenantService } from '../services/register-tenant.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly registerTenantService: RegisterTenantService,
  ) {}

  @Post('register-tenant')
  @HttpCode(HttpStatus.CREATED)
  async registerTenant(
    @Body() dto: RegisterTenantDto,
  ) {
    const result = await this.registerTenantService.execute(dto);

    return {
      success: true,
      message: 'Tenant created successfully',
      data: result,
    };
  }
}