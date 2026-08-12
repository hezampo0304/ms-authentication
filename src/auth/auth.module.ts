import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { RegisterTenantService } from './services/register-tenant.service';
import { AuthRepository } from './repositories/auth.repository';

import { PrismaModule } from '../prisma/prisma.module';

import { JwtModule } from '@nestjs/jwt';

import { PasswordService } from './services/password.service';
import { JwtService } from './services/jwt.service';
import { LoginService } from './services/login.service';
import { ConfigModule } from '@nestjs/config';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LogoutService } from './services/logout.service';
import { ProfileService } from './services/profile.service';
import { RefreshTokenService } from './services/refresh-token.service';

import { join } from 'path';
import { readFileSync } from 'fs';
import { PermissionGuard } from './guards/permission.guard';
import { SessionClient } from 'src/infraestructure/session/session.client';

@Module({
  imports: [
    ConfigModule,

    PrismaModule,

    JwtModule.register({
  privateKey: readFileSync(
    join(process.cwd(), 'jwt-private.pem'),
    'utf8',
  ),

  publicKey: readFileSync(
    join(process.cwd(), 'jwt-public.pem'),
    'utf8',
  ),

  signOptions: {
    algorithm: 'RS256',
  },
}),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
  RegisterTenantService,
  LoginService,
  JwtService,
  JwtAuthGuard,
  PermissionGuard,
  PasswordService,
  AuthRepository,
  LogoutService,
  RefreshTokenService,
  ProfileService,
  SessionClient,
],

  exports: [
    JwtService,
  ],
})
export class AuthModule {}