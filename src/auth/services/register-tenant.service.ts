import { Injectable } from '@nestjs/common';
import { RegisterTenantDto } from '../dto/register-tenant.dto';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class RegisterTenantService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(dto: RegisterTenantDto) {
    return this.authRepository.registerTenant(dto);
  }
}