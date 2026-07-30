export class ApiSuccessResponse<T> {

  readonly success = true;

  readonly timestamp: string;

  constructor(
    public readonly data: T,
  ) {
    this.timestamp = new Date().toISOString();
  }

}