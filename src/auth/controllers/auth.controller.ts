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
import { ProfileService } from '../services/profile.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { PermissionGuard } from '../guards/permission.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerTenantService: RegisterTenantService,
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly profileService: ProfileService,
    private readonly refreshTokenService: RefreshTokenService,
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
    const user = request['user'] as JwtPayload;
    return this.profileService.execute(
    user.sub,
  );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(
    @Req() request: Request,
  ) {
    const user = request['user'] as JwtPayload;
    console.log('User from request:', user);
    return this.logoutService.execute(
      user.sessionId,
    );
  }

  @Post('refresh')
@HttpCode(HttpStatus.OK)
refresh(
  @Body() dto: RefreshTokenDto,
) {
  return this.refreshTokenService.execute(dto);
}


@Get('test/users')
@UseGuards(
  JwtAuthGuard,
  PermissionGuard,
)
@RequirePermission('reports.read')
testUsersPermission() {
  return {
    success: true,
    message: 'You have users.read permission.',
  };
}


}
