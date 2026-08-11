import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { NotFoundException } from '@nestjs/common';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { AssignRolesDto } from '../dto/assign-roles.dto';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async createPermission(dto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: dto,
    });
  }

  async findPermissions() {
    return this.prisma.permission.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async createRole(dto: CreateRoleDto) {
  return this.prisma.role.create({
    data: {
      tenantId: dto.tenantId,
      name: dto.name,
      description: dto.description,
    },
  });
}

async findRolesByTenant(tenantId: string) {
  return this.prisma.role.findMany({
    where: {
      tenantId,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

async assignPermissionsToRole(
  roleId: string,
  dto: AssignPermissionsDto,
) {
  const role = await this.prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new NotFoundException('Role not found');
  }

  const permissions = await this.prisma.permission.findMany({
    where: {
      id: {
        in: dto.permissionIds,
      },
    },
  });

  if (permissions.length !== dto.permissionIds.length) {
    throw new NotFoundException('One or more permissions not found');
  }

  await this.prisma.rolePermission.createMany({
    data: dto.permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    })),
    skipDuplicates: true,
  });

  return this.prisma.role.findUnique({
    where: {
      id: roleId,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

async assignRolesToUser(
  userId: string,
  dto: AssignRolesDto,
) {
  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const roles = await this.prisma.role.findMany({
    where: {
      id: {
        in: dto.roleIds,
      },
    },
  });

  if (roles.length !== dto.roleIds.length) {
    throw new NotFoundException('One or more roles not found');
  }

  const invalidTenantRole = roles.some(
    (role) => role.tenantId !== user.tenantId,
  );

  if (invalidTenantRole) {
    throw new BadRequestException(
      'User and role must belong to the same tenant',
    );
  }

  await this.prisma.userRole.createMany({
    data: dto.roleIds.map((roleId) => ({
      userId,
      roleId,
    })),
    skipDuplicates: true,
  });

  return this.prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
}