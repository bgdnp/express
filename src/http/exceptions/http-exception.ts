import { HttpStatus } from '@common/enums';
import { Exception } from '@common/exception';

type HttpExceptionOptions = {
  status: HttpStatus;
  code: string;
  message?: string;
  cause?: Error;
};

export class HttpException extends Exception {
  readonly status: HttpStatus;

  constructor({ status, ...options }: HttpExceptionOptions) {
    super(options);
    this.status = status;
  }
}
