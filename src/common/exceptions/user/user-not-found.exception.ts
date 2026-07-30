import { BusinessException } from '../business.exception';
import { UserResponses } from 'src/common/response/user.responses';

export class UserNotFoundException extends BusinessException {
  constructor() {
    super(UserResponses.USER_NOT_FOUND);
  }
}