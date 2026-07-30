import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { RegisterTenantService } from './services/register-tenant.service';
import { AuthRepository } from './repositories/auth.repository';

import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './services/password.service';
import { JwtService } from './services/jwt.service';
import { LoginService } from './services/login.service';


@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    RegisterTenantService,
    LoginService,
    JwtService,
    PasswordService,
    AuthRepository,
  ],
})
export class AuthModule {}