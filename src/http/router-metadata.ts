import { ControllerConstructor, Handler, HttpMethod, RoutePath } from '@common/types';

type RouteMetadata = {
  method: HttpMethod;
  path: RoutePath;
  handler: Handler;
};

type ControllerMetadata = {
  prefix: RoutePath;
  cls: ControllerConstructor;
  routes: RouteMetadata[];
};

export class RouterMetadata {
  private static routes: RouteMetadata[] = [];
  private static controllers: Map<string, ControllerMetadata> = new Map();

  static setRoute(metadata: RouteMetadata) {
    this.routes.push(metadata);
  }

  static setController(metadata: Omit<ControllerMetadata, 'routes'>) {
    this.controllers.set(metadata.cls.name, {
      ...metadata,
      routes: this.routes,
    });
    this.routes = [];
  }

  static getController(name: string): ControllerMetadata {
    const controller = this.controllers.get(name);

    if (!controller) {
      throw new Error();
    }

    return controller;
  }
}
