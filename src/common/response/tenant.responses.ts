import { HttpStatus } from '@nestjs/common';
import { ResponseCode } from './response-code';

export const TenantResponses = {

  ALREADY_EXISTS:

    new ResponseCode(
      'TENANT_001',
      'Tenant already exists',
      HttpStatus.CONFLICT,
    ),

  NOT_FOUND:

    new ResponseCode(
      'TENANT_002',
      'Tenant not found',
      HttpStatus.NOT_FOUND,
    ),

};