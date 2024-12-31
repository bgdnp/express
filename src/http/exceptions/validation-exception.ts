import { ErrorCode, HttpStatus } from '@common/enums';

import { HttpException } from './http-exception';

type ValidationExceptionOptions = {
  message?: string;
  cause?: Error;
};

export class ValidationException extends HttpException {
  constructor(options?: ValidationExceptionOptions) {
    super({
      status: HttpStatus.BadRequest,
      code: ErrorCode.HTTP_ValidationFailed,
      message: options?.message ?? 'Validation failed.',
      cause: options?.cause,
    });
  }
}
