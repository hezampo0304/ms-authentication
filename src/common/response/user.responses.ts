import { HttpStatus } from '@nestjs/common';
import { ResponseCode } from './response-code';

export const UserResponses = {

  EMAIL_ALREADY_EXISTS:

    new ResponseCode(
      'USER_001',
      'Email already exists',
      HttpStatus.CONFLICT,
    ),

  USER_NOT_FOUND:

    new ResponseCode(
      'USER_002',
      'User not found',
      HttpStatus.NOT_FOUND,
    ),

};