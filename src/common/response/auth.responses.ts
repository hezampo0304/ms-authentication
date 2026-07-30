import { HttpStatus } from '@nestjs/common';
import { ResponseCode } from './response-code';

export const AuthResponses = {

  INVALID_CREDENTIALS:

    new ResponseCode(
      'AUTH_001',
      'Invalid credentials',
      HttpStatus.UNAUTHORIZED,
    ),

  INVALID_REFRESH_TOKEN:

    new ResponseCode(
      'AUTH_002',
      'Invalid refresh token',
      HttpStatus.UNAUTHORIZED,
    ),

  USER_INACTIVE:

    new ResponseCode(
      'AUTH_003',
      'User account is not active',
      HttpStatus.FORBIDDEN,
    ),

  SESSION_NOT_FOUND:

    new ResponseCode(
      'AUTH_004',
      'Session not found',
      HttpStatus.NOT_FOUND,
    ),

  USER_NOT_FOUND:

    new ResponseCode(
      'AUTH_005',
      'User not found',
      HttpStatus.NOT_FOUND,
    ),
    

};