import { MIDDLEWARE_NEXT, MIDDLEWARE_SKIP } from '@common/constants';
import { HandlerResult } from '@common/types';

import { HttpRequest } from './http-request';

export abstract class HttpMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract handle(request: HttpRequest<any>): Promise<HandlerResult | symbol>;

  protected next(): symbol {
    return MIDDLEWARE_NEXT;
  }

  protected skip(): symbol {
    return MIDDLEWARE_SKIP;
  }
}
