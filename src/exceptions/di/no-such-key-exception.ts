import { ErrorCode } from '../error-code';
import { Exception } from '../exception';

export class NoSuchKeyException extends Exception {
  constructor(message?: string) {
    super({ code: ErrorCode.DI_NO_SUCH_KEY, message });
  }
}
