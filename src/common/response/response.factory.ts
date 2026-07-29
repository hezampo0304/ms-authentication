import { ApiResponseDto } from './api-response.dto';

export class ResponseFactory {

  static success<T>(
    data: T,
    message = 'Operation completed successfully.',
  ): ApiResponseDto<T> {

    return {
      success: true,
      message,
      data,
      timestamp: new Date(),
    };

  }

}