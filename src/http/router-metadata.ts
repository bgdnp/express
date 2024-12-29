import { ArgsMapper, ControllerConstructor, Handler, HttpMethod, RoutePath } from '@common/types';

type RouteMetadata = {
  method: HttpMethod;
  path: RoutePath;
  handler: Handler;
  argsMapper?: ArgsMapper;
};

type ControllerMetadata = {
  prefix: RoutePath;
  cls: ControllerConstructor;
  routes: RouteMetadata[];
};

export class RouterMetadata {
  private static routes: Map<Handler, RouteMetadata> = new Map();
  private static controllers: Map<string, ControllerMetadata> = new Map();

  static setRoute(handler: Handler, metadata: Partial<RouteMetadata>) {
    this.routes.set(handler, metadata as RouteMetadata);
  }

  static getRoute(handler: Handler): RouteMetadata | null {
    return this.routes.get(handler) ?? null;
  }

  static setController(metadata: Omit<ControllerMetadata, 'routes'>) {
    this.controllers.set(metadata.cls.name, {
      ...metadata,
      routes: [...this.routes.values()],
    });
    this.routes = new Map();
  }

  static getController(name: string): ControllerMetadata {
    const controller = this.controllers.get(name);

    if (!controller) {
      throw new Error();
    }

    return controller;
  }
}
