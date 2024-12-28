import { HttpStatus } from '@common/enums';
import { HandlerResult } from '@common/types';

export class HttpResponse {
  static success(status: HttpStatus, body?: object): HandlerResult {
    return { status, body };
  }

  static ok(body?: object): HandlerResult {
    return this.success(HttpStatus.OK, body);
  }

  static created(body?: object): HandlerResult {
    return this.success(HttpStatus.Created, body);
  }

  static noContent(): HandlerResult {
    return this.success(HttpStatus.NoContent);
  }
}
