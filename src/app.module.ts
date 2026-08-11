import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { validationSchema } from './config/validation';
import configuration from './config/configuration';
import { KafkaModule } from './infraestructure/kafka/kafka.module';
import { RbacModule } from './modules/rbac/rbac.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
      load: configuration,
    }),
    PrismaModule,
    TenantModule,
    AuthModule,
    HealthModule,
    KafkaModule,
    RbacModule
  ]
})
export class AppModule {}
