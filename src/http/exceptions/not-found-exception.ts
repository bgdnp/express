import { ErrorCode, HttpStatus } from '@common/enums';

import { HttpException } from './http-exception';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super({
      status: HttpStatus.NotFound,
      code: ErrorCode.HTTP_NotFound,
      message: message ?? 'Route not found.',
    });
  }
}
