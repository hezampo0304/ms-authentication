import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterTenantDto } from '../dto/register-tenant.dto';
import { RegisterTenantService } from '../services/register-tenant.service';
import { LoginService } from '../services/login.service';
import { LoginDto } from '../dto/login.dto';
import { Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly registerTenantService: RegisterTenantService,
    private readonly loginService: LoginService,
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

  @Post('login')
async login(
  @Body() dto: LoginDto,
  @Req() request: Request,
) {
  console.log(`LOGIN REQUEST: ${JSON.stringify(dto)}`);
  const result = await this.loginService.execute(
    dto,
    request.ip,
    request.headers['user-agent'],
  );

  return {
    success: true,
    message: 'Login successful',
    data: result,
  };
}
}