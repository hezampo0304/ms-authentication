import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { RegisterTenantService } from './services/register-tenant.service';
import { AuthRepository } from './repositories/auth.repository';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    RegisterTenantService,
    AuthRepository,
  ],
})
export class AuthModule {}