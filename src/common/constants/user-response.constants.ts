import { HttpStatus } from '@nestjs/common';
import { ResponseCode } from '../response/response-code';

export const USER_RESPONSE = {

  NOT_FOUND: new ResponseCode(
    'USER_001',
    'User not found.',
    HttpStatus.NOT_FOUND,
  ),

  INACTIVE: new ResponseCode(
    'USER_002',
    'User account is inactive.',
    HttpStatus.FORBIDDEN,
  ),

};