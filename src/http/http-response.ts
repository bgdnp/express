import { HttpStatus } from '@common/enums';

type HttpResponseInput = {
  status: HttpStatus;
  body?: object;
};

export class HttpResponse {
  readonly status: HttpStatus;
  readonly body?: object;

  constructor({ status, body }: HttpResponseInput) {
    this.status = status;
    this.body = body;
  }

  static ok(body: object): HttpResponse {
    return new HttpResponse({ status: HttpStatus.OK, body });
  }

  static created(body: object): HttpResponse {
    return new HttpResponse({ status: HttpStatus.Created, body });
  }

  static noContent(): HttpResponse {
    return new HttpResponse({ status: HttpStatus.NoContent });
  }
}
