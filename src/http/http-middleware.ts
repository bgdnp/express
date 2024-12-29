import { HttpRequest } from './http-request';
import { HandlerResult } from '@common/types';

export const NEXT = Symbol();
export const SKIP = Symbol();

export abstract class HttpMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract handle(request: HttpRequest<any>): Promise<HandlerResult | symbol>;

  protected get next(): symbol {
    return NEXT;
  }

  protected get skip(): symbol {
    return SKIP;
  }
}
