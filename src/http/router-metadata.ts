import { ArgsMapper, ControllerConstructor, Handler, HttpMethod, RoutePath } from '@common/types';

import { HttpMiddleware } from './http-middleware';

type RouteMetadata = {
  method: HttpMethod;
  path: RoutePath;
  handler: Handler;
  argsMapper: ArgsMapper;
  middlewares: HttpMiddleware[];
};

type ControllerMetadata = {
  prefix: RoutePath;
  cls: ControllerConstructor;
  routes: RouteMetadata[];
  middlewares: HttpMiddleware[];
};

export class RouterMetadata {
  private static routes: Map<Handler, RouteMetadata> = new Map();
  private static controllers: Map<ControllerConstructor, ControllerMetadata> = new Map();

  static setRoute(handler: Handler, metadata: Partial<RouteMetadata>) {
    const current = this.getRoute(handler) ?? this.defaultRouteMetadata(handler);

    this.routes.set(handler, {
      method: metadata.method ?? current.method,
      path: metadata.path ?? current.path,
      handler: handler,
      argsMapper: metadata.argsMapper ?? current.argsMapper,
      middlewares: [...current.middlewares, ...(metadata.middlewares ?? [])],
    });
  }

  static getRoute(handler: Handler): RouteMetadata | null {
    return this.routes.get(handler) ?? null;
  }

  static setController(cls: ControllerConstructor, metadata: Partial<ControllerMetadata>) {
    const current = this.getController(cls) ?? this.defaultControllerMetadata(cls);

    this.controllers.set(cls, {
      prefix: metadata.prefix ?? current.prefix,
      cls: cls,
      routes: [...current.routes, ...this.routes.values()],
      middlewares: [...current.middlewares, ...(metadata.middlewares ?? [])],
    });

    this.routes = new Map();
  }

  static getController(cls: ControllerConstructor): ControllerMetadata | null {
    return this.controllers.get(cls) ?? null;
  }

  private static defaultControllerMetadata(cls: ControllerConstructor): ControllerMetadata {
    return {
      prefix: '/',
      cls: cls,
      routes: [],
      middlewares: [],
    };
  }

  private static defaultRouteMetadata(handler: Handler): RouteMetadata {
    return {
      method: 'get',
      path: '/',
      handler: handler,
      argsMapper: (request) => [request],
      middlewares: [],
    };
  }
}
