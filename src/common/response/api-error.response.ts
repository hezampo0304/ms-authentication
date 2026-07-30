export class ApiErrorResponse {

  readonly success = false;

  readonly timestamp: string;

  constructor(
    public readonly code: string,
    public readonly message: string | string[],
    public readonly path: string,
  ) {
    this.timestamp = new Date().toISOString();
  }

}