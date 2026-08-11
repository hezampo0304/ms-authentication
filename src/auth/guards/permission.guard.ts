import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredPermission =
      this.reflector.get<string>(
        'required_permission',
        context.getHandler(),
      );

    if (!requiredPermission) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest<Request>();

    const user =
      request['user'] as JwtPayload;

    if (!user) {
      throw new ForbiddenException({
        code: 'AUTH_004',
        message: 'Authenticated user not found.',
      });
    }

    const permissions =
      user.permissions ?? [];

    if (!permissions.includes(requiredPermission)) {
      throw new ForbiddenException({
        code: 'AUTH_005',
        message: `Permission '${requiredPermission}' is required.`,
      });
    }

    return true;
  }
}