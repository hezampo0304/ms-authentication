import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { RegisterTenantService } from './services/register-tenant.service';
import { AuthRepository } from './repositories/auth.repository';

import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './services/password.service';
import { JwtService } from './services/jwt.service';
import { LoginService } from './services/login.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LogoutService } from './services/logout.service';


@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.jwt.secret'),
      }),
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
    LogoutService
  ],
})
export class AuthModule {}