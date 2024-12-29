import { ErrorCode, HttpStatus } from '@common/enums';
import { HttpException } from './http-exception';

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super({
      status: HttpStatus.Unauthorized,
      code: ErrorCode.HTTP_Unauthorized,
      message: message ?? 'Unauthorized.',
    });
  }
}
