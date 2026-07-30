import { HttpStatus } from '@nestjs/common';
import { BusinessException } from '../business.exception';
import { ERROR_CODES } from 'src/common/constants/error-codes.constants';
import { UserResponses } from 'src/common/response/user.responses';

export class EmailAlreadyExistsException extends BusinessException {
  constructor(email: string) {
    super(UserResponses.EMAIL_ALREADY_EXISTS);
  }
}