import { HttpStatus } from '@nestjs/common';

export class ResponseCode {

  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: HttpStatus,
  ) {}

}