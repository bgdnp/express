import { HttpStatus } from '@common/enums';

import { HttpRequest } from '@http/http-request';

export type Constructor<T = object> = {
  new (...args: unknown[]): T;
};

export type ControllerConstructor<T = object> = {
  new (): T;
};

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';

export type RoutePath = `/${string}`;

export type HandlerResult<TBody extends object = object> = {
  status: HttpStatus;
  body?: TBody;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (...args: any[]) => Promise<HandlerResult>;

export type DefaultRequest = {
  Body: unknown;
  Params: unknown;
  Query: unknown;
};

export type ArgsMapper<T extends Partial<DefaultRequest> = DefaultRequest> = (
  request: HttpRequest<T>,
) => unknown[];
