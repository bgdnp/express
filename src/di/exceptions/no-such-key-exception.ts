import { ErrorCode } from '@common/enums';
import { Exception } from '@common/exception';

export class NoSuchKeyException extends Exception {
  constructor(message?: string) {
    super({ code: ErrorCode.NoSuchKey, message });
  }
}
