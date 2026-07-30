import { BusinessException } from '../business.exception';
import { AuthResponses } from 'src/common/response/auth.responses';

export class InvalidCredentialsException extends BusinessException {

  constructor() {
    super(AuthResponses.INVALID_CREDENTIALS);
  }

}