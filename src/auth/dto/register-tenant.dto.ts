import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { AdminUserDto } from './admin-user.dto';

export class RegisterTenantDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  tenantName: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug: string;

  @ValidateNested()
  @Type(() => AdminUserDto)
  admin: AdminUserDto;
}