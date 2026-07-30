import { BusinessException } from '../business.exception';
import { AuthResponses } from 'src/common/response/auth.responses';

export class UserInactiveException extends BusinessException {
  constructor() {
    super(AuthResponses.USER_INACTIVE);
  }
}