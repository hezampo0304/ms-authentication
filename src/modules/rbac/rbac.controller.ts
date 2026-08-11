import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { AssignRolesDto } from '../dto/assign-roles.dto';

@Controller('permissions')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.rbacService.createPermission(dto);
  }

  @Get()
  findAll() {
    return this.rbacService.findPermissions();
  }

  @Post('roles')
    createRole(@Body() dto: CreateRoleDto) {
        return this.rbacService.createRole(dto);
    }

    @Get('roles/:tenantId')
    findRoles(@Param('tenantId') tenantId: string) {
      return this.rbacService.findRolesByTenant(tenantId);
    }

    @Post('roles/:roleId/permissions')
assignPermissions(
  @Param('roleId') roleId: string,
  @Body() dto: AssignPermissionsDto,
) {
  return this.rbacService.assignPermissionsToRole(roleId, dto);
}

@Post('users/:userId/roles')
assignRoles(
  @Param('userId') userId: string,
  @Body() dto: AssignRolesDto,
) {
  return this.rbacService.assignRolesToUser(userId, dto);
}
}