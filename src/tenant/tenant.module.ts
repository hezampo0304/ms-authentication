import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { TenantController } from './controllers/tenant.controller';
import { TenantRepository } from './repositories/tenant.repository';
import { TenantService } from './services/tenant.service';

@Module({
  imports: [PrismaModule],
  controllers: [TenantController],
  providers: [
    TenantRepository,
    TenantService,
  ],
  exports: [TenantService],
})
export class TenantModule {}