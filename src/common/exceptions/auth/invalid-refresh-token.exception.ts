import { BusinessException } from '../business.exception';
import { AuthResponses } from 'src/common/response/auth.responses';

export class InvalidRefreshTokenException extends BusinessException {
  constructor() {
    super(AuthResponses.INVALID_REFRESH_TOKEN);
  }
}