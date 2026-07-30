import { HttpStatus } from '@nestjs/common';

export class ResponseCode {

  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: HttpStatus,
  ) {}

  toResponse() {
    return {
      code: this.code,
      message: this.message,
    };
  }

  isClientError(): boolean {
    return this.httpStatus >= 400 && this.httpStatus < 500;
  }

  isServerError(): boolean {
    return this.httpStatus >= 500;
  }

}