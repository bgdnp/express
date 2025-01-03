import { HttpRequest } from '@http/http-request';
import { HttpResponse } from '@http/http-response';

export type Constructor<T = object> = {
  new (...args: unknown[]): T;
};

export type ControllerConstructor<T = object> = {
  new (): T;
};

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';

export type RoutePath = `/${string}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (...args: any[]) => Promise<HttpResponse>;

export type DefaultRequest = {
  Body: unknown;
  Params: unknown;
  Query: unknown;
};

export type ArgsMapper<T extends Partial<DefaultRequest> = DefaultRequest> = (
  request: HttpRequest<T>,
) => unknown[];

export type Enumerate<T extends object> = T[keyof T];
