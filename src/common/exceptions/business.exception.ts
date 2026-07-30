import { HttpException } from '@nestjs/common';
import { ResponseCode } from '../response/response-code';

export class BusinessException extends HttpException {

  constructor(
    response: ResponseCode,
  ) {

    super(
      {
        success: false,
        code: response.code,
        message: response.message,
      },
      response.httpStatus,
    );

  }

}