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

@Module({
  imports: [
    ConfigModule,

    PrismaModule,

    JwtModule.register({
      privateKey: readFileSync(
        join(process.cwd(), 'jwt-private.pem'),
        'utf8'
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
    PasswordService,
    AuthRepository,
    LogoutService,
    RefreshTokenService,
    ProfileService,
  ],

  exports: [
    JwtService,
  ],
})
export class AuthModule {}