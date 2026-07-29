import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService, private readonly prisma: PrismaService) {}

  @Get()
  async getHealth() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      success: true,
      service: 'ms-authentication',
      database: 'connected',
    };
  }
}