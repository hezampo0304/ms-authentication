import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { RegisterTenantDto } from '../dto/register-tenant.dto';
import { LoginDto } from '../dto/login.dto';

import { RegisterTenantService } from '../services/register-tenant.service';
import { LoginService } from '../services/login.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LogoutService } from '../services/logout.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerTenantService: RegisterTenantService,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerTenant(
    @Body() dto: RegisterTenantDto,
  ) {
    return this.registerTenantService.execute(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
  ) {
    return this.loginService.execute(
      dto,
      request.ip,
      request.headers['user-agent'],
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() request: Request) {
    return request['user'];
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(
    @Req() request: Request,
  ) {
    const user = request['user'] as JwtPayload;

    return this.logoutService.execute(
      user.sessionId,
    );
  }
}
