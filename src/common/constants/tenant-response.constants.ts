import { HttpStatus } from '@nestjs/common';
import { ResponseCode } from '../response/response-code';

export const TENANT_RESPONSE = {

  SLUG_ALREADY_EXISTS: new ResponseCode(
    'TENANT_001',
    'Tenant slug already exists.',
    HttpStatus.CONFLICT,
  ),

  NOT_FOUND: new ResponseCode(
    'TENANT_002',
    'Tenant not found.',
    HttpStatus.NOT_FOUND,
  ),

};