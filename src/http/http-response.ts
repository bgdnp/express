import { HandlerResult, HttpStatus } from '../types';

export class HttpResponse {
  static success(status: HttpStatus, body?: object): HandlerResult {
    return { status, body };
  }

  static ok(body?: object): HandlerResult {
    return this.success(200, body);
  }

  static created(body?: object): HandlerResult {
    return this.success(201, body);
  }

  static noContent(): HandlerResult {
    return this.success(204);
  }
}
