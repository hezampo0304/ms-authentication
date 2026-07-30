import { HttpStatus } from '@nestjs/common';
import { ResponseCode } from '../response/response-code';

export const AUTH_RESPONSE = {

  INVALID_CREDENTIALS: new ResponseCode(
    'AUTH_001',
    'Invalid credentials.',
    HttpStatus.UNAUTHORIZED,
  ),

  SESSION_NOT_FOUND: new ResponseCode(
    'AUTH_002',
    'Session not found.',
    HttpStatus.NOT_FOUND,
  ),

  INVALID_REFRESH_TOKEN: new ResponseCode(
    'AUTH_003',
    'Invalid refresh token.',
    HttpStatus.UNAUTHORIZED,
  ),

  REFRESH_TOKEN_REVOKED: new ResponseCode(
    'AUTH_004',
    'Refresh token has been revoked.',
    HttpStatus.UNAUTHORIZED,
  ),

  SESSION_EXPIRED: new ResponseCode(
    'AUTH_005',
    'Session expired.',
    HttpStatus.UNAUTHORIZED,
  ),

  LOGOUT_SUCCESS: new ResponseCode(
    'AUTH_006',
    'Logout successful.',
    HttpStatus.OK,
  ),

  PROFILE_NOT_FOUND: new ResponseCode(
    'AUTH_007',
    'User profile not found.',
    HttpStatus.NOT_FOUND,
  ),

  TOKEN_REFRESHED: new ResponseCode(
    'AUTH_008',
    'Token refreshed successfully.',
    HttpStatus.OK,
  ),

} as const;