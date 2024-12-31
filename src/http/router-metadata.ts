import { ArgsMapper, ControllerConstructor, Handler, HttpMethod, RoutePath } from '@common/types';

import { HttpMiddleware } from './http-middleware';

type RouteMetadata = {
  method: HttpMethod;
  path: RoutePath;
  handler: Handler;
  argsMapper?: ArgsMapper;
  middlewares?: HttpMiddleware[];
};

type ControllerMetadata = {
  prefix: RoutePath;
  cls: ControllerConstructor;
  routes: RouteMetadata[];
  middlewares?: HttpMiddleware[];
};

export class RouterMetadata {
  private static routes: Map<Handler, RouteMetadata> = new Map();
  private static controllers: Map<ControllerConstructor, ControllerMetadata> = new Map();

  static setRoute(handler: Handler, metadata: Partial<RouteMetadata>) {
    this.routes.set(handler, metadata as RouteMetadata);
  }

  static getRoute(handler: Handler): RouteMetadata | null {
    return this.routes.get(handler) ?? null;
  }

  static setController(cls: ControllerConstructor, metadata: Partial<ControllerMetadata>) {
    this.controllers.set(cls, {
      ...metadata,
      routes: [...this.routes.values()],
    } as ControllerMetadata);
    this.routes = new Map();
  }

  static getController(cls: ControllerConstructor): ControllerMetadata | null {
    return this.controllers.get(cls) ?? null;
  }
}
