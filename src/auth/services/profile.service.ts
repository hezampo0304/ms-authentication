import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AuthRepository } from '../repositories/auth.repository';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { AuthResponses, ResponseCode } from 'src/common/response';

@Injectable()
export class ProfileService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<ProfileResponseDto> {

    const user =
      await this.authRepository.findUserProfile(
        userId,
      );

    if (!user) {
      throw new NotFoundException({
        code: AuthResponses.USER_NOT_FOUND.code,
        message: 'User not found.',
      });
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
      },
    };
  }
}