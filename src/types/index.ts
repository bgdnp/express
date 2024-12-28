export type Constructor<T = object> = {
  new (...args: unknown[]): T;
};

export type ControllerConstructor<T = object> = {
  new (): T;
};

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';
export type HttpStatus = 200 | 201 | 204;

export type RoutePath = `/${string}`;

export type HandlerResult<TBody extends object = object> = {
  status: HttpStatus;
  body?: TBody;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (...args: any[]) => Promise<HandlerResult>;
