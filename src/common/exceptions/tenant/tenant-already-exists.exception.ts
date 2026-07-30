import { TenantResponses } from 'src/common/response/tenant.responses';
import { BusinessException } from '../business.exception';

export class TenantAlreadyExistsException extends BusinessException {
  constructor() {
    super(TenantResponses.ALREADY_EXISTS);
  }
}