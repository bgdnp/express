import { ErrorCode, HttpStatus } from '@common/enums';

import { HttpException } from './http-exception';

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super({
      status: HttpStatus.Unauthorized,
      code: ErrorCode.Unauthorized,
      message: message ?? 'Unauthorized.',
    });
  }
}
