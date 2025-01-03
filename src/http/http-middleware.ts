import { MIDDLEWARE_NEXT, MIDDLEWARE_SKIP } from '@common/constants';

import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export abstract class HttpMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract handle(request: HttpRequest<any>): Promise<HttpResponse | symbol>;

  protected next(): symbol {
    return MIDDLEWARE_NEXT;
  }

  protected skip(): symbol {
    return MIDDLEWARE_SKIP;
  }
}
